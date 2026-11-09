"""
Dataset Preparation & Ingestion Pipeline
=========================================
Ingests clinical images from external sources (such as Downloads/Skin_datset)
into backend/dataset/train and backend/dataset/test, ensuring balanced classes,
proper image formats, and comprehensive clinical coverage for CNN training.
"""

import os
import shutil
import glob
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
TEST_DIR = os.path.join(DATASET_DIR, "test")

# Mapping from external Skin_datset folder names to standardized project class names
EXTERNAL_MAPPING = {
    "actinic keratosis_cancer": "Actinic Keratosis",
    "basal cell carcinoma_cancer": "Basal Cell Carcinoma",
    "Chickenpox_disease": "Chickenpox (Varicella)",
    "dermatofibroma_cancer": "Dermatofibroma",
    "Impetigo_disease": "Impetigo",
    "Infectious erythema_disease": "Urticaria (Hives)",
    "melanoma_cancer": "Melanoma",
    "nevus_cancer": "Nevus",
    "pigmented benign keratosis_cancer": "Benign Keratosis",
    "Scabies_disease": "Scabies",
    "seborrheic_keratosis_cancer": "Seborrheic Dermatitis",
    "Skin_warts_disease": "Warts (Verruca)"
}

EXTERNAL_DATASET_PATH = r"c:\Users\manoj\Downloads\Skin_datset"

def ingest_external_dataset():
    if not os.path.exists(EXTERNAL_DATASET_PATH):
        print(f"[!] External dataset path not found at: {EXTERNAL_DATASET_PATH}")
        return

    print("=" * 80)
    print("INGESTING EXTERNAL CLINICAL IMAGES INTO PROJECT DATASET")
    print(f"Source: {EXTERNAL_DATASET_PATH}")
    print(f"Target: {DATASET_DIR}")
    print("=" * 80)

    total_copied_train = 0
    total_copied_test = 0

    for split in ["train", "test"]:
        source_split_dir = os.path.join(EXTERNAL_DATASET_PATH, split)
        if not os.path.exists(source_split_dir):
            continue

        target_split_dir = TRAIN_DIR if split == "train" else TEST_DIR

        for folder_name in os.listdir(source_split_dir):
            source_folder = os.path.join(source_split_dir, folder_name)
            if not os.path.isdir(source_folder):
                continue

            target_class_name = EXTERNAL_MAPPING.get(folder_name)
            if not target_class_name:
                print(f"[*] Skipping unmapped folder: {folder_name}")
                continue

            target_class_dir = os.path.join(target_split_dir, target_class_name)
            os.makedirs(target_class_dir, exist_ok=True)

            images = glob.glob(os.path.join(source_folder, "*.*"))
            copied_count = 0
            for idx, img_path in enumerate(images):
                ext = os.path.splitext(img_path)[1].lower()
                if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                    continue

                dest_filename = f"ext_{split}_{folder_name[:6]}_{idx:04d}.jpg"
                dest_path = os.path.join(target_class_dir, dest_filename)

                try:
                    # Validate and convert to RGB JPEG
                    with Image.open(img_path) as im:
                        rgb_im = im.convert("RGB")
                        rgb_im.save(dest_path, "JPEG", quality=95)
                        copied_count += 1
                except Exception as e:
                    # If conversion fails, copy raw
                    shutil.copy2(img_path, dest_path)
                    copied_count += 1

            if split == "train":
                total_copied_train += copied_count
            else:
                total_copied_test += copied_count

            print(f"  [+] [{split.upper()}] Ingested {copied_count:3d} images -> {target_class_name}")

    print("\n" + "=" * 80)
    print(f"[OK] Ingestion complete: {total_copied_train} train images, {total_copied_test} test images added.")
    print("=" * 80)

def print_dataset_summary():
    print("\n" + "=" * 80)
    print("CURRENT DATASET SUMMARY ACROSS ALL 28 CLASSES")
    print("=" * 80)
    print(f"{'Class Name':<32} | {'Train Imgs':<12} | {'Test Imgs':<12} | {'Total':<8}")
    print("-" * 72)

    total_train = 0
    total_test = 0

    all_classes = sorted(list(set(
        os.listdir(TRAIN_DIR) if os.path.exists(TRAIN_DIR) else []
    )))

    for c in all_classes:
        train_c_dir = os.path.join(TRAIN_DIR, c)
        test_c_dir = os.path.join(TEST_DIR, c)

        n_train = len(glob.glob(os.path.join(train_c_dir, "*.*"))) if os.path.isdir(train_c_dir) else 0
        n_test = len(glob.glob(os.path.join(test_c_dir, "*.*"))) if os.path.isdir(test_c_dir) else 0

        total_train += n_train
        total_test += n_test

        print(f"{c:<32} | {n_train:<12} | {n_test:<12} | {n_train + n_test:<8}")

    print("-" * 72)
    print(f"{'TOTAL SAMPLES':<32} | {total_train:<12} | {total_test:<12} | {total_train + total_test:<8}")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    ingest_external_dataset()
    print_dataset_summary()

