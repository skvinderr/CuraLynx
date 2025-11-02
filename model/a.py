# =========================================================
# Whisper Tiny Fine-Tuning (Low-Memory Adaptive Version)
# Works even on RTX 3050 (4 GB) or CPU-only systems
# =========================================================

# !pip install -q --upgrade transformers datasets accelerate evaluate jiwer tensorboard

import os, gc, torch
from huggingface_hub import login as hf_login
from transformers import (
    WhisperFeatureExtractor, WhisperTokenizer, WhisperProcessor,
    WhisperForConditionalGeneration, Seq2SeqTrainer, Seq2SeqTrainingArguments
)
from datasets import load_dataset, Audio
from dataclasses import dataclass
from typing import Any, Dict, List, Union
import evaluate

# -----------------------------
# 0. (Optional) Hugging Face auth
# -----------------------------
# Read token from environment and login for gated/private datasets/models.
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN") or os.getenv("HF_TOKEN")
if HF_TOKEN:
    try:
        hf_login(token=HF_TOKEN, add_to_git_credential=False)
        print("🔐 Hugging Face: authenticated using provided token.")
    except Exception as e:
        print(f"⚠️ Hugging Face login failed: {e}")
else:
    print("ℹ️ No Hugging Face token found in env (HUGGINGFACE_TOKEN/HF_TOKEN). Proceeding without auth.")

# -----------------------------
# 1. Detect Device and VRAM
# -----------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"
if device == "cuda":
    gpu_props = torch.cuda.get_device_properties(0)
    total_vram_gb = gpu_props.total_memory / 1024**3
    print(f"🟢 GPU: {torch.cuda.get_device_name(0)} | {total_vram_gb:.2f} GB")
else:
    total_vram_gb = 0
    print("🟡 Using CPU")

# Adaptive parameters
if total_vram_gb <= 4:
    max_samples = 2       # keep tiny subset
    batch_size = 1
    grad_accum = 1
    max_steps = 10
elif total_vram_gb <= 8:
    max_samples = 50
    batch_size = 2
    grad_accum = 4
    max_steps = 100
else:
    max_samples = 200
    batch_size = 4
    grad_accum = 8
    max_steps = 500

FULL_DATA = (os.getenv("FULL_DATA", "1") != "0")
EPOCHS = int(os.getenv("EPOCHS", "1" if device != "cuda" else "3"))
print(f"🔧 Config -> samples={max_samples}, batch={batch_size}, grad_accum={grad_accum}, steps={max_steps}")
freeze_encoder = (device != "cuda") or (max_samples <= 50)

# -----------------------------
# 2. Load Dataset (subset)
# -----------------------------
print("📥 Loading dataset...")
ds = load_dataset("ekacare/eka-medical-asr-evaluation-dataset", "hi", split="test")
# Use full dataset by default (can disable by FULL_DATA=0)
if not FULL_DATA:
    ds = ds.select(range(min(max_samples, len(ds))))
# Make our own train/val split from the full set
dataset = ds.train_test_split(test_size=0.1, seed=42)
# Avoid relying on torchcodec by disabling automatic decoding; we'll load audio manually in the collator.
# Let datasets decode audio with torchcodec (default path)
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))

# Find transcription column
transcription_col = None
for c in ['text', 'transcription', 'sentence', 'transcript', 'question']:
    if c in dataset['train'].column_names:
        transcription_col = c
        break
if transcription_col is None:
    raise ValueError(f"Could not find transcription column; available: {dataset['train'].column_names}")
print(f"✅ Transcription column: {transcription_col}")

# -----------------------------
# 3. Load Model + Processor
# -----------------------------
model_name = "openai/whisper-tiny"
print(f"🔍 Loading model: {model_name}")
feature_extractor = WhisperFeatureExtractor.from_pretrained(model_name)
tokenizer = WhisperTokenizer.from_pretrained(model_name, language="Hindi", task="transcribe")
processor = WhisperProcessor.from_pretrained(model_name, language="Hindi", task="transcribe")
model = WhisperForConditionalGeneration.from_pretrained(model_name)
# For training, don't force decoder ids (labels will drive decoding). Use generation_config for evaluation/inference.
model.config.forced_decoder_ids = None
model.generation_config.forced_decoder_ids = processor.get_decoder_prompt_ids(language="hi", task="transcribe")
# Keep Whisper's default suppress/begin_suppress tokens for better decoding behavior
model.config.use_cache = False
# Enable gradient checkpointing safely only on CUDA to avoid CPU autograd issues
if device == "cuda":
    try:
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
    except TypeError:
        # Older transformers/torch signatures
        model.gradient_checkpointing_enable()
else:
    # Ensure it's disabled on CPU
    try:
        model.gradient_checkpointing_disable()
    except Exception:
        pass

# Optionally freeze encoder for tiny datasets to improve stability
if freeze_encoder:
    for p in model.model.encoder.parameters():
        p.requires_grad = False
    print("🧊 Frozen Whisper encoder params for small-data training.")

# -----------------------------
# 4. Tokenize Text Labels
# -----------------------------
def tokenize_labels(batch):
    texts = batch[transcription_col]
    enc = tokenizer(
        texts,
        padding=False,
        truncation=True,
        add_special_tokens=False,
        max_length=min(448, tokenizer.model_max_length if tokenizer.model_max_length and tokenizer.model_max_length > 0 else 448),
    )
    batch["labels"] = enc["input_ids"]
    return batch

dataset = dataset.map(tokenize_labels, batched=True, remove_columns=[transcription_col])
print("✅ Tokenized labels, columns now:", dataset['train'].column_names)

# -----------------------------
# 5. Data Collator (compute audio on-the-fly)
# -----------------------------
@dataclass
class WhisperCollator:
    processor: Any
    pad_token_id: int
    def __call__(self, features: List[Dict[str, Any]]) -> Dict[str, torch.Tensor]:
        arrays = [f["audio"]["array"] for f in features]
        srs = [f["audio"]["sampling_rate"] for f in features]
        # Use the full processor to ensure consistent padding to 3000 frames
        proc = self.processor(
            audio=arrays,
            sampling_rate=srs[0],
            return_tensors="pt",
            padding="max_length",
            max_length=self.processor.feature_extractor.n_samples,
            truncation=True,
        )
        inputs = {"input_features": proc["input_features"]}
        label_features = [{"input_ids": f["labels"]} for f in features]
        labels_batch = self.processor.tokenizer.pad(label_features, return_tensors="pt")
        labels = labels_batch["input_ids"].masked_fill(labels_batch["input_ids"] == self.pad_token_id, -100)
        inputs["labels"] = labels
        return inputs

collator = WhisperCollator(processor, pad_token_id=tokenizer.pad_token_id)

# -----------------------------
# 6. Metrics
# -----------------------------
wer_metric = evaluate.load("wer")
cer_metric = evaluate.load("cer")
def compute_metrics(pred):
    ids = pred.predictions
    lbl = pred.label_ids
    lbl[lbl == -100] = tokenizer.pad_token_id
    pred_str = processor.tokenizer.batch_decode(ids, skip_special_tokens=True)
    lbl_str  = processor.tokenizer.batch_decode(lbl, skip_special_tokens=True)
    wer = wer_metric.compute(predictions=pred_str, references=lbl_str) * 100
    cer = cer_metric.compute(predictions=pred_str, references=lbl_str) * 100
    return {"wer": wer, "cer": cer}

# -----------------------------
# 7. Training Arguments
# -----------------------------
args = Seq2SeqTrainingArguments(
    output_dir="./whisper-tiny-test",
    per_device_train_batch_size=batch_size,
    gradient_accumulation_steps=grad_accum,
    per_device_eval_batch_size=1,
    fp16=(device=="cuda"),
    learning_rate=1e-5,
    num_train_epochs=EPOCHS,
    logging_steps=10,
    eval_strategy="epoch",
    save_steps=500,
    save_total_limit=1,
    predict_with_generate=True,
    generation_num_beams=5,
    label_smoothing_factor=0.1,
    dataloader_num_workers=0,
    remove_unused_columns=False,
    report_to=[],
)

# -----------------------------
# 8. Trainer
# -----------------------------
trainer = Seq2SeqTrainer(
    model=model,
    args=args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    data_collator=collator,
    compute_metrics=compute_metrics,
    tokenizer=processor.tokenizer,
)

# -----------------------------
# 9. Clear Memory & Train
# -----------------------------
gc.collect()
if device == "cuda": torch.cuda.empty_cache()
model.to(device)

print("🚀 Starting training ...")
trainer.train()

# -----------------------------
# 10. Save & Evaluate
# -----------------------------
trainer.save_model("./whisper-tiny-test-final")
processor.save_pretrained("./whisper-tiny-test-final")

print("🔎 Evaluating ...")
res = trainer.evaluate()
print("✅ Final eval WER:", res.get("eval_wer", res.get("wer", "N/A")))

# -----------------------------
# 11. Quick Inference Check
# -----------------------------
sample = dataset["test"][0]
proc_infer = processor(
    audio=sample["audio"]["array"],
    sampling_rate=sample["audio"]["sampling_rate"],
    return_tensors="pt",
    padding="max_length",
    max_length=processor.feature_extractor.n_samples,
    truncation=True,
)
inp = proc_infer.input_features
inp = inp.to(device)
with torch.no_grad():
    gen_ids = model.generate(inp, num_beams=5)
decoded = processor.tokenizer.batch_decode(gen_ids, skip_special_tokens=True)[0]
print("\n🎙️  Sample transcription:", decoded)
print("\n✅ Training pipeline complete.")
