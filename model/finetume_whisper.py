import torch
from datasets import load_dataset, Audio
from transformers import (
    WhisperFeatureExtractor,
    WhisperTokenizer,
    WhisperProcessor,
    WhisperForConditionalGeneration,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
)
import evaluate
import numpy as np

# -----------------------------
# 1️⃣ Configuration
# -----------------------------
model_name = "openai/whisper-small"     # choose size: base / small / medium / large‐v3
language = "en"                          # dataset is primarily English
task = "transcribe"                      # only transcription (not translation)
dataset_id = "ekacare/eka-medical-asr-evaluation-dataset"
dataset_subset = "en"                    # use the English subset
num_train_samples = 3000                 # you may train on ~3,600 samples (use less or more depending on compute)
eval_samples = 200                       # small eval set

# -----------------------------
# 2️⃣ Load dataset
# -----------------------------
dataset = load_dataset(dataset_id, dataset_subset, split="train")  # check if “train” exists; else use “test” or full
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))
dataset = dataset.shuffle(seed=42).select(range(num_train_samples))

# Separate out an eval set
eval_dataset = dataset.select(range(eval_samples))
train_dataset = dataset.select(range(eval_samples, len(dataset)))

# -----------------------------
# 3️⃣ Load processor
# -----------------------------
feature_extractor = WhisperFeatureExtractor.from_pretrained(model_name)
tokenizer = WhisperTokenizer.from_pretrained(model_name, language=language, task=task)
processor = WhisperProcessor.from_pretrained(model_name, language=language, task=task)

# -----------------------------
# 4️⃣ Preprocess dataset
# -----------------------------
def prepare_batch(batch):
    audio = batch["audio"]
    # create input features
    batch["input_features"] = feature_extractor(
        audio["array"], sampling_rate=audio["sampling_rate"]
    ).input_features[0]
    # encode labels
    batch["labels"] = tokenizer(batch["text"]).input_ids
    return batch

train_dataset = train_dataset.map(prepare_batch, remove_columns=train_dataset.column_names)
eval_dataset = eval_dataset.map(prepare_batch, remove_columns=eval_dataset.column_names)

# -----------------------------
# 5️⃣ Load model
# -----------------------------
model = WhisperForConditionalGeneration.from_pretrained(model_name)
model.config.forced_decoder_ids = None
model.config.suppress_tokens = []

# -----------------------------
# 6️⃣ Define metrics
# -----------------------------
metric = evaluate.load("wer")

def compute_metrics(pred):
    pred_ids = np.argmax(pred.predictions, axis=-1)
    pred_str = tokenizer.batch_decode(pred_ids, skip_special_tokens=True)
    label_str = tokenizer.batch_decode(pred.label_ids, skip_special_tokens=True)
    wer = 100 * metric.compute(predictions=pred_str, references=label_str)
    return {"wer": wer}

# -----------------------------
# 7️⃣ Training arguments
# -----------------------------
training_args = Seq2SeqTrainingArguments(
    output_dir="./whisper-finetuned-medical",
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=1e-5,
    warmup_steps=200,
    max_steps=1000,
    fp16=torch.cuda.is_available(),
    evaluation_strategy="steps",
    save_strategy="steps",
    predict_with_generate=True,
    generation_max_length=225,
    logging_steps=50,
    save_steps=500,
    eval_steps=500,
    report_to="none",
)

# -----------------------------
# 8️⃣ Trainer setup & train
# -----------------------------
trainer = Seq2SeqTrainer(
    args=training_args,
    model=model,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=processor.feature_extractor,
    compute_metrics=compute_metrics,
)

trainer.train()

# -----------------------------
# 9️⃣ Save fine‐tuned model
# -----------------------------
trainer.save_model("./whisper-finetuned-medical")
print("✅ Fine-tuning complete! Model saved at ./whisper-finetuned-medical")

# -----------------------------
# 🔟 (Optional) Convert to faster-whisper format for inference
# In terminal run:
# ct2-transformers-converter --model ./whisper-finetuned-medical --output_dir ./faster-whisper-medical
#
# Then use:
# from faster_whisper import WhisperModel
# model = WhisperModel("./faster-whisper-medical")
# segments, info = model.transcribe("audio.wav")
