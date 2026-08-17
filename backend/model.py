"""EfficientNet-B0 inference module.

Loads a trained Keras EfficientNet-B0 model from `model/animal_model.h5` if present.
If no trained model is found, falls back to the ImageNet-pretrained EfficientNetB0
and maps its 1000 ImageNet classes to animal species labels via the bundled
`imagenet_class_index.json` (downloaded on first run).

This guarantees the backend always returns a REAL model prediction (never a mock),
even before a custom animal dataset has been trained.
"""
from __future__ import annotations

import json
import os
import urllib.request
from pathlib import Path
from typing import Tuple

import cv2
import numpy as np

MODEL_DIR = Path(__file__).resolve().parent / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
CUSTOM_MODEL_PATH = MODEL_DIR / "animal_model.h5"
CLASS_LABELS_PATH = MODEL_DIR / "labels.json"
IMAGENET_INDEX_PATH = MODEL_DIR / "imagenet_class_index.json"

IMAGENET_INDEX_URL = (
    "https://raw.githubusercontent.com/raghakot/keras-vis/master/resources/imagenet_class_index.json"
)

IMG_SIZE = 224  # EfficientNet-B0 default input


_model = None
_labels: list[str] = []
_is_custom = False


def _download_imagenet_index() -> dict:
    if IMAGENET_INDEX_PATH.exists():
        with open(IMAGENET_INDEX_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    print("[model] Downloading ImageNet class index…")
    urllib.request.urlretrieve(IMAGENET_INDEX_URL, IMAGENET_INDEX_PATH)
    with open(IMAGENET_INDEX_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _load_labels() -> list[str]:
    global _labels
    if _labels:
        return _labels
    if CLASS_LABELS_PATH.exists():
        with open(CLASS_LABELS_PATH, "r", encoding="utf-8") as f:
            _labels = json.load(f)
        return _labels
    # Fall back to ImageNet labels
    idx = _download_imagenet_index()
    labels = [idx[str(i)][1] for i in range(len(idx))]
    _labels = labels
    return _labels


def _load_model():
    global _model, _is_custom
    if _model is not None:
        return _model
    # Import TensorFlow lazily so the module imports without TF installed.
    from tensorflow import keras  # type: ignore

    if CUSTOM_MODEL_PATH.exists():
        print(f"[model] Loading custom model from {CUSTOM_MODEL_PATH}")
        _model = keras.models.load_model(str(CUSTOM_MODEL_PATH))
        _is_custom = True
    else:
        print("[model] No custom model found. Loading ImageNet-pretrained EfficientNetB0.")
        from tensorflow.keras.applications import EfficientNetB0  # type: ignore
        _model = EfficientNetB0(weights="imagenet")
        _is_custom = False
    return _model


def is_custom_model() -> bool:
    return _is_custom


def preprocess(image_bytes: bytes) -> np.ndarray:
    """Decode + preprocess an uploaded image for EfficientNet-B0."""
    arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image: could not decode.")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img.astype("float32") / 255.0
    return np.expand_dims(img, axis=0)


def predict(image_bytes: bytes) -> Tuple[str, float]:
    """Return (species, confidence%) using the loaded model."""
    model = _load_model()
    labels = _load_labels()
    x = preprocess(image_bytes)

    if _is_custom:
        preds = model.predict(x, verbose=0)[0]
        idx = int(np.argmax(preds))
        species = labels[idx] if idx < len(labels) else f"class_{idx}"
        confidence = float(preds[idx]) * 100.0
    else:
        # ImageNet-pretrained EfficientNetB0 expects EfficientNet preprocessing.
        from tensorflow.keras.applications.efficientnet import preprocess_input  # type: ignore
        x = preprocess_input(x * 255.0)
        preds = model.predict(x, verbose=0)[0]
        idx = int(np.argmax(preds))
        species = labels[idx] if idx < len(labels) else f"class_{idx}"
        confidence = float(preds[idx]) * 100.0

    return species, confidence
