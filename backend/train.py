"""Train an EfficientNet-B0 model on an animal species image dataset.

Expected dataset layout (configurable via --data-dir):

    data/
      train/
        tiger/
          img1.jpg
          img2.jpg
        lion/
          ...
      val/
        tiger/
          ...
        lion/
          ...

After training, the model is saved to backend/model/animal_model.h5 and the
class labels to backend/model/labels.json. The FastAPI backend automatically
picks these up on next start.

Usage:
    python train.py --data-dir ./data --epochs 20 --batch-size 32
"""
import argparse
import json
from pathlib import Path

import numpy as np

MODEL_DIR = Path(__file__).resolve().parent / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Train EfficientNet-B0 for animal species classification.")
    parser.add_argument("--data-dir", type=str, required=True, help="Path to dataset root (with train/ and val/ subfolders).")
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--img-size", type=int, default=224)
    parser.add_argument("--output", type=str, default=str(MODEL_DIR / "animal_model.h5"))
    args = parser.parse_args()

    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers
    from tensorflow.keras.applications import EfficientNetB0
    from tensorflow.keras.preprocessing import image_dataset_from_directory

    data_dir = Path(args.data_dir)
    train_dir = data_dir / "train"
    val_dir = data_dir / "val"
    if not train_dir.exists():
        raise SystemExit(f"Training directory not found: {train_dir}")

    # Datasets
    train_ds = image_dataset_from_directory(
        train_dir,
        image_size=(args.img_size, args.img_size),
        batch_size=args.batch_size,
        shuffle=True,
        label_mode="categorical",
    )
    class_names = train_ds.class_names
    print(f"[train] Classes ({len(class_names)}): {class_names}")

    val_ds = None
    if val_dir.exists():
        val_ds = image_dataset_from_directory(
            val_dir,
            image_size=(args.img_size, args.img_size),
            batch_size=args.batch_size,
            shuffle=False,
            label_mode="categorical",
        )

    # Augmentation + model
    data_aug = keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.1),
            layers.RandomZoom(0.1),
            layers.RandomContrast(0.1),
        ],
        name="augmentation",
    )

    base = EfficientNetB0(include_top=False, weights="imagenet", input_shape=(args.img_size, args.img_size, 3))
    base.trainable = False  # transfer learning: freeze backbone first

    inputs = keras.Input(shape=(args.img_size, args.img_size, 3))
    x = data_aug(inputs)
    from tensorflow.keras.applications.efficientnet import preprocess_input
    x = preprocess_input(x)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(len(class_names), activation="softmax")(x)
    model = keras.Model(inputs, outputs)

    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    callbacks = [
        keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(patience=3),
    ]

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        callbacks=callbacks,
    )

    # Optional fine-tuning: unfreeze top layers of the backbone.
    base.trainable = True
    model.compile(
        optimizer=keras.optimizers.Adam(1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=max(5, args.epochs // 4),
        callbacks=callbacks,
    )

    out_path = Path(args.output)
    model.save(str(out_path))
    print(f"[train] Model saved to {out_path}")

    labels_path = MODEL_DIR / "labels.json"
    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump(class_names, f)
    print(f"[train] Labels saved to {labels_path}")


if __name__ == "__main__":
    main()
