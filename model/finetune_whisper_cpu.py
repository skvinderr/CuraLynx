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
# 1️⃣ Config
# -----------------------------
model_name = "openai/whisper-tiny"   # smallest, best for CPU training
language = "en"
task = "transcribe"
dataset_id = "ekacare/eka-medical-asr-evaluation-dataset"
dataset_subset = "en"

# -----------------------------
# 2️⃣ Load dataset
# -----------------------------
dataset = load_dataset(dataset_id, dataset_subset, split="test")  # this dataset mostly has 'test' split
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))
dataset = dataset.shuffle(seed=42).select(range(200))  # just 200 samples for demo/training

# small validation set
eval_dataset = dataset.select(range(20))
train_dataset = dataset.select(range(20, len(dataset)))

# -----------------------------
# 3️⃣ Processor
# -----------------------------
feature_extractor = WhisperFeatureExtractor.from_pretrained(model_name)
tokenizer = WhisperTokenizer.from_pretrained(model_name, language=language, task=task)
processor = WhisperProcessor.from_pretrained(model_name, language=language, task=task)

# -----------------------------
# 4️⃣ Prepare dataset
# -----------------------------
def prepare_batch(batch):
    audio = batch["audio"]
    batch["input_features"] = feature_extractor(
        audio["array"], sampling_rate=audio["sampling_rate"]
    ).input_features[0]
    batch["labels"] = tokenizer(batch["text"]).input_ids
    return batch

train_dataset = train_dataset.map(prepare_batch, remove_columns=train_dataset.column_names)
eval_dataset = eval_dataset.map(prepare_batch, remove_columns=eval_dataset.column_names)

# -----------------------------
# 5️⃣ Model
# -----------------------------
model = WhisperForConditionalGeneration.from_pretrained(model_name)
model.config.forced_decoder_ids = None
model.config.suppress_tokens = []

# -----------------------------
# 6️⃣ Metric
# -----------------------------
metric = evaluate.load("wer")

def compute_metrics(pred):
    pred_ids = np.argmax(pred.predictions, axis=-1)
    pred_str = tokenizer.batch_decode(pred_ids, skip_special_tokens=True)
    label_str = tokenizer.batch_decode(pred.label_ids, skip_special_tokens=True)
    wer = 100 * metric.compute(predictions=pred_str, references=label_str)
    return {"wer": wer}

# -----------------------------
# 7️⃣ Training args (CPU)
# -----------------------------
training_args = Seq2SeqTrainingArguments(
    output_dir="./whisper-finetuned-cpu",
    per_device_train_batch_size=1,    # small batch for CPU
    gradient_accumulation_steps=1,
    learning_rate=1e-5,
    num_train_epochs=1,               # just 1 epoch for demo
    evaluation_strategy="epoch",
    predict_with_generate=True,
    logging_steps=10,
    report_to="none",
    fp16=False,                       # disable GPU mixed precision
    bf16=False,
    dataloader_num_workers=0,
)

# -----------------------------
# 8️⃣ Trainer
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
# 9️⃣ Save model
# -----------------------------
trainer.save_model("./whisper-finetuned-cpu")
print("✅ Fine-tuning done (CPU). Model saved at ./whisper-finetuned-cpu")
