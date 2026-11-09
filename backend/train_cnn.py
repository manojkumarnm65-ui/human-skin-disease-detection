"""
SkinCare AI - Convolutional Neural Network (CNN) Training & Evaluation Pipeline
==============================================================================
Trains, validates, and evaluates a Deep Convolutional Neural Network across all 28
dermatological conditions using the expanded clinical dataset adhering to ML best practices:
- Uses physical train and independent test directories (dataset/train and dataset/test)
- Employs data augmentation (rotations, flips, zoom, contrast)
- Uses class weighting to handle class distribution imbalance
- Employs hierarchical Conv2D + BatchNorm + Pooling + Dropout architecture
- Uses EarlyStopping and ReduceLROnPlateau to optimize convergence
- Computes Top-1 & Top-3 Accuracy, Precision, Recall, F1-Score, and Confusion Matrix
- Exports production weights to `backend/models/skin_disease_model.keras`
"""

import os
import sys
import json
import argparse
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Ensure backend directory is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import tensorflow as tf
from tensorflow.keras import layers, models, regularizers, callbacks
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.utils.class_weight import compute_class_weight

DATASET_DIR = os.path.join(BASE_DIR, "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
TEST_DIR = os.path.join(DATASET_DIR, "test")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_DESTINATION = os.path.join(MODELS_DIR, "skin_disease_model.keras")
CLASS_NAMES_DESTINATION = os.path.join(MODELS_DIR, "class_names.json")
REPORT_DESTINATION = os.path.join(MODELS_DIR, "cnn_evaluation_report.json")
PLOTS_DESTINATION = os.path.join(MODELS_DIR, "cnn_training_performance.png")

IMG_SIZE = (128, 128)
BATCH_SIZE = 32

def load_or_update_class_names():
    """Retrieves or aligns the registered 28 disease class names."""
    if os.path.exists(TRAIN_DIR):
        classes = sorted([d for d in os.listdir(TRAIN_DIR) if os.path.isdir(os.path.join(TRAIN_DIR, d))])
    elif os.path.exists(CLASS_NAMES_DESTINATION):
        with open(CLASS_NAMES_DESTINATION, 'r') as f:
            classes = json.load(f)
    else:
        raise FileNotFoundError("Could not find train dataset or class_names.json")

    with open(CLASS_NAMES_DESTINATION, 'w') as f:
        json.dump(classes, f, indent=2)

    print(f"[Dataset] Identified {len(classes)} clinical classes.")
    return classes

def build_skin_disease_cnn(num_classes, input_shape=(128, 128, 3)):
    """
    Constructs a Deep Multi-Scale Convolutional Neural Network (CNN)
    specifically designed for dermatological feature extraction and classification.
    """
    inputs = layers.Input(shape=input_shape)

    # 1. Normalization & Preprocessing
    x = layers.Rescaling(1.0 / 255.0)(inputs)

    # 2. On-the-fly Data Augmentation layers
    x = layers.RandomFlip("horizontal_and_vertical")(x)
    x = layers.RandomRotation(0.15)(x)
    x = layers.RandomZoom(0.1)(x)
    x = layers.RandomTranslation(0.05, 0.05)(x)

    # 3. Convolutional Block 1 - Fine lesion borders & textures (32 filters)
    x = layers.Conv2D(32, (3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.Conv2D(32, (3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Dropout(0.2)(x)

    # 4. Convolutional Block 2 - Morphological structure & pigment patterns (64 filters)
    x = layers.Conv2D(64, (3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.Conv2D(64, (3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Dropout(0.25)(x)

    # 5. Convolutional Block 3 - Intermediate vascular and lesion features (128 filters)
    x = layers.Conv2D(128, (3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.Conv2D(128, (3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Dropout(0.3)(x)

    # 6. Convolutional Block 4 - High-level semantic diagnostic abstractions (256 filters)
    x = layers.Conv2D(256, (3, 3), padding='same', use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Dropout(0.35)(x)

    # 7. Classification Head
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, kernel_regularizer=regularizers.l2(1e-4))(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.Dropout(0.4)(x)

    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.25)(x)

    outputs = layers.Dense(num_classes, activation='softmax', name='prediction_probs')(x)

    model = models.Model(inputs=inputs, outputs=outputs, name='SkinCare_AI_CNN')
    return model

def compute_weights(train_dataset, num_classes):
    """Computes balanced class weights from dataset batches."""
    all_labels = []
    for _, labels in train_dataset:
        all_labels.extend(np.argmax(labels.numpy(), axis=1))
    all_labels = np.array(all_labels)

    classes_present = np.unique(all_labels)
    weights = compute_class_weight('balanced', classes=classes_present, y=all_labels)
    weight_dict = {int(c): float(w) for c, w in zip(classes_present, weights)}

    # Ensure all classes have an entry
    for c in range(num_classes):
        if c not in weight_dict:
            weight_dict[c] = 1.0

    return weight_dict

def train_and_evaluate(epochs=20, batch_size=32):
    class_names = load_or_update_class_names()
    num_classes = len(class_names)

    print("=" * 80)
    print("STARTING SKIN DISEASE CNN TRAINING & TESTING PIPELINE")
    print(f"Number of classes: {num_classes}")
    print(f"Target Image Size: {IMG_SIZE}")
    print(f"Batch Size:        {batch_size}")
    print(f"Max Epochs:        {epochs}")
    print("=" * 80)

    # 1. Load Training & Validation datasets (85% Train, 15% Validation split)
    raw_train_ds = tf.keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        validation_split=0.15,
        subset="training",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=batch_size,
        label_mode='categorical',
        class_names=class_names,
        shuffle=True
    )

    raw_val_ds = tf.keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        validation_split=0.15,
        subset="validation",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=batch_size,
        label_mode='categorical',
        class_names=class_names,
        shuffle=False
    )

    # 2. Load Independent Test Dataset
    test_ds = tf.keras.utils.image_dataset_from_directory(
        TEST_DIR,
        image_size=IMG_SIZE,
        batch_size=batch_size,
        label_mode='categorical',
        class_names=class_names,
        shuffle=False
    )

    # 3. Calculate class balance weights
    class_weights = compute_weights(raw_train_ds, num_classes)
    print(f"[Class Weights] Computed balanced weights for {len(class_weights)} classes.")

    # 4. Prefetching for performance
    train_ds = raw_train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    val_ds = raw_val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    # 5. Build CNN Model
    model = build_skin_disease_cnn(num_classes, input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
    model.summary()

    # 6. Compile Model
    top3_metric = tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy', top3_metric]
    )

    # 7. Training Callbacks
    os.makedirs(MODELS_DIR, exist_ok=True)
    cb_list = [
        callbacks.EarlyStopping(
            monitor='val_loss',
            patience=6,
            restore_best_weights=True,
            verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=2,
            min_lr=1e-6,
            verbose=1
        ),
        callbacks.ModelCheckpoint(
            filepath=MODEL_DESTINATION,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]

    print("\n[*] Training CNN across dermatological dataset...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        class_weight=class_weights,
        callbacks=cb_list
    )

    # Ensure best weights are saved
    model.save(MODEL_DESTINATION)
    print(f"\n[OK] Trained CNN weights saved to: {MODEL_DESTINATION}")

    # 8. Independent Test Evaluation adhering to ml-best-practices
    print("\n" + "=" * 80)
    print("EVALUATING CNN ON UNSEEN INDEPENDENT TEST DATASET")
    print("=" * 80)

    y_true_indices = []
    y_pred_probs = []

    for images, labels in test_ds:
        preds = model.predict(images, verbose=0)
        y_pred_probs.extend(preds)
        y_true_indices.extend(np.argmax(labels.numpy(), axis=1))

    y_true_indices = np.array(y_true_indices)
    y_pred_probs = np.array(y_pred_probs)
    y_pred_indices = np.argmax(y_pred_probs, axis=1)

    # Top-1 & Top-3 Accuracies
    top1_acc = accuracy_score(y_true_indices, y_pred_indices)

    top3_correct = 0
    for true_label, prob_dist in zip(y_true_indices, y_pred_probs):
        top3_preds = np.argsort(prob_dist)[-3:]
        if true_label in top3_preds:
            top3_correct += 1
    top3_acc = top3_correct / len(y_true_indices)

    # Classification report
    present_classes = sorted(list(set(y_true_indices)))
    target_names = [class_names[i] for i in present_classes]

    report_str = classification_report(
        y_true_indices, y_pred_indices, target_names=target_names, zero_division=0
    )
    report_dict = classification_report(
        y_true_indices, y_pred_indices, target_names=target_names, output_dict=True, zero_division=0
    )

    # Confusion Matrix
    cm = confusion_matrix(y_true_indices, y_pred_indices)

    print("\n" + "=" * 80)
    print("CNN CLINICAL EVALUATION REPORT (INDEPENDENT TEST FOLDER)")
    print("=" * 80)
    print(report_str)
    print(f"Top-1 Categorical Accuracy:   {top1_acc * 100:.2f}%")
    print(f"Top-3 Differential Accuracy:  {top3_acc * 100:.2f}%")
    print(f"Macro Average F1-Score:       {report_dict['macro avg']['f1-score']:.4f}")
    print(f"Weighted Average F1-Score:    {report_dict['weighted avg']['f1-score']:.4f}")
    print("=" * 80)

    # 9. Save Evaluation Metrics
    metrics_bundle = {
        'model_architecture': 'Deep Multi-Scale CNN (SkinNet-CNN)',
        'framework': 'TensorFlow / Keras 3',
        'input_resolution': list(IMG_SIZE),
        'num_classes': num_classes,
        'class_names': class_names,
        'test_metrics': {
            'top1_accuracy': float(top1_acc),
            'top3_accuracy': float(top3_acc),
            'macro_f1': float(report_dict['macro avg']['f1-score']),
            'weighted_f1': float(report_dict['weighted avg']['f1-score']),
            'total_test_samples': int(len(y_true_indices))
        },
        'per_class_metrics': {
            name: {
                'precision': float(report_dict[name]['precision']),
                'recall': float(report_dict[name]['recall']),
                'f1_score': float(report_dict[name]['f1-score']),
                'support': int(report_dict[name]['support'])
            }
            for name in target_names if name in report_dict
        }
    }

    with open(REPORT_DESTINATION, 'w') as f:
        json.dump(metrics_bundle, f, indent=2)
    print(f"[OK] Evaluation report saved to: {REPORT_DESTINATION}")

    # 10. Generate Training Performance Charts
    try:
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

        # Accuracy
        ax1.plot(history.history['accuracy'], label='Train Accuracy', color='#087BFF', lw=2)
        ax1.plot(history.history['val_accuracy'], label='Validation Accuracy', color='#08C9F5', lw=2)
        ax1.set_title('CNN Categorical Accuracy per Epoch', fontsize=12, fontweight='bold')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Accuracy')
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='lower right')

        # Loss
        ax1_loss = ax2.plot(history.history['loss'], label='Train Loss', color='#FF6B6B', lw=2)
        ax2.plot(history.history['val_loss'], label='Validation Loss', color='#FFA94D', lw=2)
        ax2.set_title('CNN Loss per Epoch', fontsize=12, fontweight='bold')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Categorical Crossentropy Loss')
        ax2.grid(True, alpha=0.3)
        ax2.legend(loc='upper right')

        plt.tight_layout()
        plt.savefig(PLOTS_DESTINATION, dpi=150)
        plt.close()
        print(f"[OK] Training history visualization saved to: {PLOTS_DESTINATION}")
    except Exception as e:
        print(f"[!] Warning: Could not save training plots: {e}")

    return metrics_bundle

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="SkinCare AI CNN Training & Evaluation")
    parser.add_argument('--epochs', type=int, default=15, help="Number of training epochs")
    parser.add_argument('--batch-size', type=int, default=32, help="Batch size for training")
    args = parser.parse_args()

    train_and_evaluate(epochs=args.epochs, batch_size=args.batch_size)

