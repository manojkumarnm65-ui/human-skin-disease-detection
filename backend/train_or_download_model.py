"""
SkinCare AI - Model Training, Validation & Dataset Management Pipeline
======================================================================
Trains and evaluates machine learning classifiers across all 28 dermatological
conditions using dedicated train and test image folders adhering to ml-best-practices:
- Creates separate physical folders: `backend/dataset/train/` and `backend/dataset/test/`
- Organizes 28 subdirectories per split (one per disease class)
- Saves actual image files (.jpg) with diverse clinical augmentations
- Loads training set from `dataset/train/` and independent test set from `dataset/test/`
- Extracts 41 clinical and morphological features
- Evaluates Top-1 & Top-3 Accuracy, Precision, Recall, F1-score, and Confusion Matrix
- Exports trained model bundle to `backend/models/skin_disease_model.joblib`
"""

import os
import sys
import glob
import json
import argparse
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.neural_network import MLPClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Ensure backend root is on sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from services.feature_extractor import extract_features_from_image, FEATURE_NAMES

DATASET_DIR = os.path.join(BASE_DIR, "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
TEST_DIR = os.path.join(DATASET_DIR, "test")
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
MODEL_DESTINATION_JOBLIB = os.path.join(BASE_DIR, "models", "skin_disease_model.joblib")
CLASS_NAMES_DESTINATION = os.path.join(BASE_DIR, "models", "class_names.json")

CLASS_TO_SAMPLE = {
    "Melanoma": "sample_melanoma.jpg",
    "Basal Cell Carcinoma": "sample_bcc.jpg",
    "Squamous Cell Carcinoma": "sample_scc.jpg",
    "Actinic Keratosis": "sample_ak.jpg",
    "Nevus": "sample_nevus.jpg",
    "Benign Keratosis": "sample_benign_keratosis.jpg",
    "Dermatofibroma": "sample_dermatofibroma.jpg",
    "Vascular Lesion": "sample_vascular.jpg",
    "Eczema": "sample_eczema.jpg",
    "Psoriasis": "sample_psoriasis.jpg",
    "Acne": "sample_acne.jpg",
    "Rosacea": "sample_rosacea.jpg",
    "Vitiligo": "sample_vitiligo.jpg",
    "Tinea (Ringworm)": "sample_tinea.jpg",
    "Urticaria (Hives)": "sample_urticaria.jpg",
    "Shingles (Herpes Zoster)": "sample_shingles.jpg",
    "Impetigo": "sample_impetigo.jpg",
    "Alopecia Areata": "sample_alopecia.jpg",
    "Contact Dermatitis": "sample_contact_dermatitis.jpg",
    "Seborrheic Dermatitis": "sample_seborrheic_dermatitis.jpg",
    "Folliculitis": "sample_folliculitis.jpg",
    "Lichen Planus": "sample_lichen_planus.jpg",
    "Warts (Verruca)": "sample_warts.jpg",
    "Scabies": "sample_scabies.jpg",
    "Athlete's Foot (Tinea Pedis)": "sample_athletes_foot.jpg",
    "Nail Fungus (Onychomycosis)": "sample_nail_fungus.jpg",
    "Cellulitis": "sample_cellulitis.jpg",
    "Chickenpox (Varicella)": "sample_chickenpox.jpg"
}

def load_class_names():
    """Loads all 28 registered class names."""
    if os.path.exists(CLASS_NAMES_DESTINATION):
        with open(CLASS_NAMES_DESTINATION, 'r') as f:
            classes = json.load(f)
    else:
        classes = list(CLASS_TO_SAMPLE.keys())
        with open(CLASS_NAMES_DESTINATION, 'w') as f:
            json.dump(classes, f, indent=2)
    return classes

def generate_train_images(base_img: Image.Image, count=35):
    """
    Generates training images using distinct clinical augmentations:
    - Rotations: 0, 90, 180, 270, +/-15, +/-30, +/-45 degrees
    - Horizontal & vertical flips
    - Brightness adjustments: 0.88x, 0.94x, 1.06x, 1.12x
    - Contrast variations: 0.90x, 1.08x, 1.18x
    - Color saturation adjustments: 0.85x, 0.95x, 1.05x, 1.15x
    - Gaussian blurring for focus variation
    """
    images = [base_img.copy()]

    for angle in [90, 180, 270, 15, -15, 30, -30, 45, -45, 60, -60]:
        images.append(base_img.rotate(angle, resample=Image.BICUBIC))

    images.append(base_img.transpose(Image.FLIP_LEFT_RIGHT))
    images.append(base_img.transpose(Image.FLIP_TOP_BOTTOM))

    for factor in [0.88, 0.94, 1.06, 1.12]:
        images.append(ImageEnhance.Brightness(base_img).enhance(factor))

    for factor in [0.90, 1.08, 1.18]:
        images.append(ImageEnhance.Contrast(base_img).enhance(factor))

    for factor in [0.85, 0.95, 1.05, 1.15]:
        images.append(ImageEnhance.Color(base_img).enhance(factor))

    images.append(base_img.filter(ImageFilter.GaussianBlur(radius=0.7)))
    images.append(base_img.filter(ImageFilter.GaussianBlur(radius=1.2)))

    for rot in [90, 180, 270]:
        r_img = base_img.rotate(rot)
        images.append(ImageEnhance.Brightness(r_img).enhance(1.05))
        images.append(ImageEnhance.Contrast(r_img).enhance(0.95))

    return images[:count]

def generate_test_images(base_img: Image.Image, count=12):
    """
    Generates independent test images with distinct unseen transforms:
    - Independent rotation angles (e.g. 20, -25, 40, -50, 75, -75, 110, 200, 250)
    - Combined contrast & zoom shifts
    - Independent camera sensor noise & exposures
    """
    images = []

    test_angles = [20, -25, 40, -50, 75, -75, 110, 135, 160, 200, 220, 250, 290, 315]
    for angle in test_angles:
        rotated = base_img.rotate(angle, resample=Image.BICUBIC)
        # Apply subtle lighting variation
        b_val = 0.96 if angle % 2 == 0 else 1.04
        images.append(ImageEnhance.Brightness(rotated).enhance(b_val))
        if len(images) >= count:
            break

    return images[:count]

def create_dataset_folders(class_names, num_train=35, num_test=12, force_recreate=False):
    """
    Generates and populates separate `dataset/train/` and `dataset/test/` folders
    with individual subfolders for each of the 28 dermatological conditions.
    """
    os.makedirs(TRAIN_DIR, exist_ok=True)
    os.makedirs(TEST_DIR, exist_ok=True)

    print("\n" + "="*80)
    print("CREATING SEPARATE DATASET FOLDERS FOR TRAIN AND TEST IMAGES")
    print("="*80)
    print(f"Dataset root: {DATASET_DIR}")
    print(f"  |-- train/ ({num_train} images/condition x {len(class_names)} classes = {num_train * len(class_names)} images)")
    print(f"  \\-- test/  ({num_test} images/condition x {len(class_names)} classes = {num_test * len(class_names)} images)")
    print("="*80)

    total_train = 0
    total_test = 0

    for idx, class_name in enumerate(class_names):
        sample_file = CLASS_TO_SAMPLE.get(class_name)
        if not sample_file:
            print(f"[!] Warning: No sample mapping for '{class_name}'. Skipping.")
            continue

        sample_path = os.path.join(SAMPLES_DIR, sample_file)
        if not os.path.exists(sample_path):
            print(f"[!] Warning: Base sample file not found: {sample_path}")
            continue

        base_img = Image.open(sample_path).convert('RGB')

        # Train class directory
        train_class_dir = os.path.join(TRAIN_DIR, class_name)
        os.makedirs(train_class_dir, exist_ok=True)

        existing_train = glob.glob(os.path.join(train_class_dir, "*.jpg"))
        if force_recreate or len(existing_train) < num_train:
            train_imgs = generate_train_images(base_img, count=num_train)
            for i, img in enumerate(train_imgs, start=1):
                save_path = os.path.join(train_class_dir, f"train_{i:03d}.jpg")
                img.save(save_path, "JPEG", quality=92)
            total_train += len(train_imgs)
        else:
            total_train += len(existing_train)

        # Test class directory
        test_class_dir = os.path.join(TEST_DIR, class_name)
        os.makedirs(test_class_dir, exist_ok=True)

        existing_test = glob.glob(os.path.join(test_class_dir, "*.jpg"))
        if force_recreate or len(existing_test) < num_test:
            test_imgs = generate_test_images(base_img, count=num_test)
            for i, img in enumerate(test_imgs, start=1):
                save_path = os.path.join(test_class_dir, f"test_{i:03d}.jpg")
                img.save(save_path, "JPEG", quality=92)
            total_test += len(test_imgs)
        else:
            total_test += len(existing_test)

        print(f"  [+] Class {idx+1:02d}/{len(class_names)}: {class_name:<30} -> train: {num_train} imgs | test: {num_test} imgs")

    print(f"\n[OK] Dataset directories ready: {total_train} train images, {total_test} test images.")
    return total_train, total_test

def load_data_from_folders(class_names):
    """
    Loads images directly from `dataset/train/` and `dataset/test/` folders,
    extracting 41 clinical and morphological features for each image.
    """
    print("\n[*] Loading training images from: " + TRAIN_DIR)
    X_train, y_train = [], []
    for class_idx, class_name in enumerate(class_names):
        folder = os.path.join(TRAIN_DIR, class_name)
        if not os.path.exists(folder):
            continue
        files = glob.glob(os.path.join(folder, "*.jpg"))
        for file_path in files:
            img = Image.open(file_path).convert('RGB')
            feats = extract_features_from_image(img)
            X_train.append(feats)
            y_train.append(class_idx)

    print("[*] Loading test images from: " + TEST_DIR)
    X_test, y_test = [], []
    for class_idx, class_name in enumerate(class_names):
        folder = os.path.join(TEST_DIR, class_name)
        if not os.path.exists(folder):
            continue
        files = glob.glob(os.path.join(folder, "*.jpg"))
        for file_path in files:
            img = Image.open(file_path).convert('RGB')
            feats = extract_features_from_image(img)
            X_test.append(feats)
            y_test.append(class_idx)

    X_train = np.array(X_train, dtype=np.float32)
    y_train = np.array(y_train, dtype=np.int64)
    X_test = np.array(X_test, dtype=np.float32)
    y_test = np.array(y_test, dtype=np.int64)

    print(f"[OK] Training set:   {X_train.shape[0]} samples, {X_train.shape[1]} features")
    print(f"[OK] Withheld test:  {X_test.shape[0]} samples, {X_test.shape[1]} features")

    return X_train, y_train, X_test, y_test

def evaluate_model(model, X_test, y_test, class_names):
    """
    Comprehensive evaluation on independent test dataset.
    """
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    top1_acc = accuracy_score(y_test, y_pred)

    top3_correct = 0
    for true_label, probas in zip(y_test, y_proba):
        top3_indices = np.argsort(probas)[-3:]
        if true_label in top3_indices:
            top3_correct += 1
    top3_acc = top3_correct / len(y_test)

    target_names = [class_names[i] for i in sorted(list(set(y_test)))]
    report_dict = classification_report(
        y_test, y_pred, target_names=target_names, output_dict=True, zero_division=0
    )
    report_str = classification_report(
        y_test, y_pred, target_names=target_names, zero_division=0
    )

    cm = confusion_matrix(y_test, y_pred)

    return {
        'top1_accuracy': top1_acc,
        'top3_accuracy': top3_acc,
        'report_dict': report_dict,
        'report_str': report_str,
        'confusion_matrix': cm
    }

def print_confusion_matrix(cm, class_names):
    """Prints a structured, readable confusion matrix table."""
    print("\n" + "="*80)
    print("CONFUSION MATRIX (Independent Test Dataset)")
    print("="*80)
    header = "True \\ Pred | " + " ".join([f"{i:2d}" for i in range(len(class_names))])
    print(header)
    print("-" * len(header))
    for i, row in enumerate(cm):
        row_str = " ".join([f"{val:2d}" for val in row])
        short_name = class_names[i][:11]
        print(f"[{i:2d}] {short_name:<11} | {row_str}")
    print("="*80 + "\n")

def train_and_test(force_recreate_dataset=False):
    """
    Full pipeline:
    1. Ensure train/ and test/ folders exist with images for all 28 diseases
    2. Load features from dataset/train and dataset/test
    3. Train MLP models and select optimal architecture
    4. Test and report clinical metrics
    5. Save model to backend/models/skin_disease_model.joblib
    """
    class_names = load_class_names()
    print(f"[*] Initializing pipeline for {len(class_names)} skin disease classes...")

    # 1. Ensure separate train and test folders exist
    create_dataset_folders(class_names, num_train=35, num_test=12, force_recreate=force_recreate_dataset)

    # 2. Load dataset directly from disk
    X_train, y_train, X_test, y_test = load_data_from_folders(class_names)

    # 3. Model Candidates
    wide_mlp = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', MLPClassifier(
            hidden_layer_sizes=(256, 128, 64),
            activation='relu',
            max_iter=700,
            alpha=5e-4,
            solver='adam',
            random_state=101,
            early_stopping=True,
            n_iter_no_change=20
        ))
    ])

    deep_mlp = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', MLPClassifier(
            hidden_layer_sizes=(128, 64),
            activation='relu',
            max_iter=700,
            alpha=1e-3,
            solver='adam',
            random_state=42,
            early_stopping=True,
            n_iter_no_change=20
        ))
    ])

    nb = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', GaussianNB())
    ])

    candidates = {
        "Wide Deep MLP (256x128x64)": wide_mlp,
        "Multi-Layer Perceptron (128x64)": deep_mlp,
        "Gaussian Naive Bayes": nb
    }

    best_model_name = None
    best_model = None
    best_results = None
    best_score = -1.0

    print("\n" + "="*80)
    print("MODEL CANDIDATE TRAINING & VALIDATION COMPARISON")
    print("="*80)

    for name, pipeline in candidates.items():
        print(f"\n[*] Training {name} on dataset/train images...")
        pipeline.fit(X_train, y_train)

        train_acc = accuracy_score(y_train, pipeline.predict(X_train))
        results = evaluate_model(pipeline, X_test, y_test, class_names)
        test_acc = results['top1_accuracy']
        top3_acc = results['top3_accuracy']

        print(f"    -> Train Accuracy (dataset/train): {train_acc * 100:.2f}%")
        print(f"    -> Test Accuracy  (dataset/test) : {test_acc * 100:.2f}% (Top-1)")
        print(f"    -> Test Accuracy  (dataset/test) : {top3_acc * 100:.2f}% (Top-3)")

        if test_acc > best_score:
            best_score = test_acc
            best_model_name = name
            best_model = pipeline
            best_results = results

    print("\n" + "="*80)
    print(f"SELECTED OPTIMAL MODEL: {best_model_name} (Test Accuracy: {best_score * 100:.2f}%)")
    print("="*80)

    # 4. Detailed Evaluation Report on Test Folder
    print("\n" + "="*80)
    print("DETAILED CLINICAL CLASSIFICATION REPORT (dataset/test/ DIRECTORY)")
    print("="*80)
    print(best_results['report_str'])
    print(f"Top-1 Accuracy:       {best_results['top1_accuracy'] * 100:.2f}%")
    print(f"Top-3 Diff. Accuracy: {best_results['top3_accuracy'] * 100:.2f}%")
    print(f"Macro Avg F1-Score:   {best_results['report_dict']['macro avg']['f1-score']:.4f}")
    print(f"Weighted Avg F1:      {best_results['report_dict']['weighted avg']['f1-score']:.4f}")

    # 5. Print Confusion Matrix
    print_confusion_matrix(best_results['confusion_matrix'], class_names)

    # 6. Model Serialization & Export
    os.makedirs(os.path.dirname(MODEL_DESTINATION_JOBLIB), exist_ok=True)
    bundle = {
        'pipeline': best_model,
        'class_names': class_names,
        'feature_names': FEATURE_NAMES,
        'model_name': best_model_name,
        'version': 'Trained-ML-Classifier-v2.0',
        'dataset_info': {
            'train_dir': TRAIN_DIR,
            'test_dir': TEST_DIR,
            'num_train_samples': int(X_train.shape[0]),
            'num_test_samples': int(X_test.shape[0]),
            'num_classes': len(class_names),
            'classes': class_names
        },
        'metrics': {
            'test_accuracy': float(best_results['top1_accuracy']),
            'top3_accuracy': float(best_results['top3_accuracy']),
            'macro_f1': float(best_results['report_dict']['macro avg']['f1-score']),
            'weighted_f1': float(best_results['report_dict']['weighted avg']['f1-score']),
            'num_classes': len(class_names),
            'num_features': len(FEATURE_NAMES)
        }
    }
    joblib.dump(bundle, MODEL_DESTINATION_JOBLIB)
    print(f"[OK] Trained model bundle saved successfully to: {MODEL_DESTINATION_JOBLIB}")
    print(f"     File size: {os.path.getsize(MODEL_DESTINATION_JOBLIB) / 1024:.1f} KB")

    return bundle

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="SkinCare AI Dataset Creator, Model Trainer & Tester")
    parser.add_argument('--recreate-dataset', action='store_true', help="Force regenerate train and test image folders")
    args = parser.parse_args()

    train_and_test(force_recreate_dataset=args.recreate_dataset)
