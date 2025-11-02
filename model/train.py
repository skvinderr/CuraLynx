#!/usr/bin/env python3
"""
Whisper Fine-tuning for Local CPU
Optimized for CPU training with reduced memory usage
"""

import os
import sys

# CRITICAL: Disable torchcodec BEFORE importing datasets
# This forces datasets to use FFmpeg directly
os.environ["DATASETS_AUDIO_BACKEND"] = "ffmpeg"

# Mock torchcodec to prevent datasets from trying to import it
sys.modules['torchcodec'] = None

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
from dataclasses import dataclass
from typing import Any, Dict, List, Union
from huggingface_hub import login

# -----------------------------
# 🔑 Authentication
# -----------------------------
# Option 1: Use environment variable (recommended)
if "HF_TOKEN" in os.environ:
    login(token=os.environ["HF_TOKEN"])
    print("✅ Logged in using HF_TOKEN environment variable")
else:
    raise ValueError("HF_TOKEN environment variable not set. Please set it to your Hugging Face token.")

# -----------------------------
# ⚙️ Configuration
# -----------------------------
print("\n" + "="*50)
print("🖥️  LOCAL CPU TRAINING CONFIGURATION")
print("="*50)

# Model settings
model_name = "openai/whisper-tiny"  # Smallest model for CPU
language = "en"
task = "transcribe"

# Dataset settings
dataset_id = "ekacare/eka-medical-asr-evaluation-dataset"
dataset_subset = "en"
num_samples = 100  # Reduced for CPU (change to 200 for full demo)

# Training settings (CPU optimized)
batch_size = 2  # Small batch for CPU
gradient_accumulation = 4  # Effective batch = 8
num_epochs = 2  # Reduced epochs for faster training
learning_rate = 1e-5

# Output
output_dir = "./whisper-finetuned-cpu"

print(f"\n📋 Settings:")
print(f"   Model: {model_name}")
print(f"   Dataset samples: {num_samples}")
print(f"   Batch size: {batch_size}")
print(f"   Epochs: {num_epochs}")
print(f"   Output: {output_dir}")

# -----------------------------
# 🔧 Device Check
# -----------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"\n🚀 Device: {device}")
if device == "cpu":
    print("   ⚠️  Training on CPU will be slower (2-4 hours expected)")
    print("   💡 Consider using Google Colab with GPU for faster training")

# -----------------------------
# 📥 Load Dataset
# -----------------------------
print("\n📥 Loading dataset...")
print("   Using FFmpeg for audio decoding")

try:
    dataset = load_dataset(dataset_id, dataset_subset, split="test")
    print(f"   Total available: {len(dataset)} samples")
    
    # Cast audio to correct format - FFmpeg will handle decoding
    dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))
    
    # Select subset
    dataset = dataset.shuffle(seed=42).select(range(num_samples))
    
    # Split: 20% validation, 80% training
    val_size = int(0.2 * len(dataset))
    eval_dataset = dataset.select(range(val_size))
    train_dataset = dataset.select(range(val_size, len(dataset)))
    
    print(f"✅ Training samples: {len(train_dataset)}")
    print(f"✅ Validation samples: {len(eval_dataset)}")
    
except Exception as e:
    print(f"\n❌ Error loading dataset: {e}")
    print("\n💡 Troubleshooting:")
    print("1. Ensure FFmpeg is in PATH: ffmpeg -version")
    print("2. Restart terminal after installing FFmpeg")
    print("3. Try: pip uninstall torchcodec -y")
    print("4. Check internet connection")
    raise

# -----------------------------
# 🔧 Load Processor
# -----------------------------
print("\n🔧 Loading processor...")
feature_extractor = WhisperFeatureExtractor.from_pretrained(model_name)
tokenizer = WhisperTokenizer.from_pretrained(model_name, language=language, task=task)
processor = WhisperProcessor.from_pretrained(model_name, language=language, task=task)
print("✅ Processor loaded")

# -----------------------------
# 📦 Data Collator
# -----------------------------
@dataclass
class DataCollatorSpeechSeq2SeqWithPadding:
    processor: Any

    def __call__(self, features: List[Dict[str, Union[List[int], torch.Tensor]]]) -> Dict[str, torch.Tensor]:
        input_features = [{"input_features": feature["input_features"]} for feature in features]
        batch = self.processor.feature_extractor.pad(input_features, return_tensors="pt")

        label_features = [{"input_ids": feature["labels"]} for feature in features]
        labels_batch = self.processor.tokenizer.pad(label_features, return_tensors="pt")

        labels = labels_batch["input_ids"].masked_fill(labels_batch.attention_mask.ne(1), -100)

        if (labels[:, 0] == self.processor.tokenizer.bos_token_id).all().cpu().item():
            labels = labels[:, 1:]

        batch["labels"] = labels
        return batch

data_collator = DataCollatorSpeechSeq2SeqWithPadding(processor=processor)

# -----------------------------
# ⚙️ Prepare Dataset
# -----------------------------
print("\n⚙️ Preparing dataset...")

def prepare_batch(batch):
    audio = batch["audio"]
    batch["input_features"] = feature_extractor(
        audio["array"], sampling_rate=audio["sampling_rate"]
    ).input_features[0]
    batch["labels"] = tokenizer(batch["text"]).input_ids
    return batch

print("   Processing training data...")
train_dataset = train_dataset.map(
    prepare_batch,
    remove_columns=train_dataset.column_names,
    desc="Training"
)

print("   Processing validation data...")
eval_dataset = eval_dataset.map(
    prepare_batch,
    remove_columns=eval_dataset.column_names,
    desc="Validation"
)

print("✅ Dataset prepared")

# -----------------------------
# 🤖 Load Model
# -----------------------------
print("\n🤖 Loading model...")
model = WhisperForConditionalGeneration.from_pretrained(model_name)
model.config.forced_decoder_ids = None
model.config.suppress_tokens = []
model.config.use_cache = False

print(f"✅ Model loaded ({sum(p.numel() for p in model.parameters())/1e6:.1f}M parameters)")

# -----------------------------
# 📊 Evaluation Metric
# -----------------------------
print("\n📊 Loading evaluation metric...")
metric = evaluate.load("wer")

def compute_metrics(pred):
    pred_ids = pred.predictions
    label_ids = pred.label_ids

    label_ids[label_ids == -100] = tokenizer.pad_token_id

    pred_str = tokenizer.batch_decode(pred_ids, skip_special_tokens=True)
    label_str = tokenizer.batch_decode(label_ids, skip_special_tokens=True)

    wer = 100 * metric.compute(predictions=pred_str, references=label_str)
    return {"wer": wer}

print("✅ Metric loaded")

# -----------------------------
# 🏋️ Training Arguments
# -----------------------------
print("\n🏋️ Setting up training...")

training_args = Seq2SeqTrainingArguments(
    output_dir=output_dir,
    per_device_train_batch_size=batch_size,
    gradient_accumulation_steps=gradient_accumulation,
    learning_rate=learning_rate,
    warmup_steps=20,
    num_train_epochs=num_epochs,
    gradient_checkpointing=False,  # Disable for CPU
    fp16=False,  # No mixed precision on CPU
    evaluation_strategy="epoch",
    per_device_eval_batch_size=batch_size,
    predict_with_generate=True,
    generation_max_length=225,
    save_strategy="epoch",
    save_total_limit=2,
    load_best_model_at_end=True,
    metric_for_best_model="wer",
    greater_is_better=False,
    logging_steps=5,
    logging_first_step=True,
    report_to=["none"],  # Disable wandb, tensorboard
    push_to_hub=False,
    remove_unused_columns=False,
    dataloader_num_workers=0,  # No multiprocessing on CPU
)

# -----------------------------
# 🎯 Initialize Trainer
# -----------------------------
trainer = Seq2SeqTrainer(
    args=training_args,
    model=model,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
    tokenizer=processor.feature_extractor,
)

print("✅ Trainer initialized")

# -----------------------------
# 🚀 Start Training
# -----------------------------
print("\n" + "="*50)
print("🚀 STARTING TRAINING")
print("="*50)
print(f"Total steps: {len(train_dataset) // (batch_size * gradient_accumulation) * num_epochs}")
print(f"Estimated time: 2-4 hours on CPU")
print("="*50 + "\n")

import time
start_time = time.time()

try:
    trainer.train()
    training_time = time.time() - start_time
    
    print("\n" + "="*50)
    print("✅ TRAINING COMPLETED!")
    print("="*50)
    print(f"⏱️  Time taken: {training_time/60:.1f} minutes")
    
except KeyboardInterrupt:
    print("\n⚠️  Training interrupted by user")
    print("💾 Saving current model state...")
    trainer.save_model(output_dir)
    print(f"✅ Model saved to {output_dir}")
    exit(0)

# -----------------------------
# 💾 Save Model
# -----------------------------
print("\n💾 Saving final model...")
trainer.save_model(output_dir)
processor.save_pretrained(output_dir)
print(f"✅ Model saved to {output_dir}")

# -----------------------------
# 📊 Final Evaluation
# -----------------------------
print("\n📊 Running final evaluation...")
metrics = trainer.evaluate()
print(f"\n🎯 Final WER: {metrics['eval_wer']:.2f}%")

# -----------------------------
# 🧪 Test Sample
# -----------------------------
print("\n🧪 Testing on a sample...")
sample = eval_dataset[0]
input_features = torch.tensor([sample["input_features"]]).unsqueeze(0)

model.eval()
with torch.no_grad():
    predicted_ids = model.generate(input_features)
    transcription = tokenizer.batch_decode(predicted_ids, skip_special_tokens=True)[0]

print(f"\n📝 Predicted: {transcription}")
print(f"🎯 Reference: {tokenizer.decode(sample['labels'], skip_special_tokens=True)}")

# -----------------------------
# ✅ Summary
# -----------------------------
print("\n" + "="*50)
print("🎉 ALL DONE!")
print("="*50)
print(f"📁 Model location: {output_dir}")
print(f"📊 Final WER: {metrics['eval_wer']:.2f}%")
print(f"⏱️  Total time: {training_time/60:.1f} minutes")
print("\n💡 To use your model:")
print(f"   from transformers import pipeline")
print(f"   pipe = pipeline('automatic-speech-recognition', model='{output_dir}')")
print(f"   result = pipe('audio.wav')")
print("="*50)