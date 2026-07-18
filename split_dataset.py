import os
import random
import shutil

# ===========================
# CHANGE THESE PATHS ONLY
# ===========================
SOURCE_DIR = r"D:\food_freshness_monitoring_platform\dataset"          # Your original dataset
OUTPUT_DIR = r"D:\food_freshness_monitoring_platform\output"        # New split dataset

# Split Ratio
TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

random.seed(42)

# Create output folders
for split in ["train", "val", "test"]:
    os.makedirs(os.path.join(OUTPUT_DIR, split), exist_ok=True)

# Traverse all category folders
for category in os.listdir(SOURCE_DIR):

    category_path = os.path.join(SOURCE_DIR, category)

    if not os.path.isdir(category_path):
        continue

    # Traverse class folders
    for class_name in os.listdir(category_path):

        class_path = os.path.join(category_path, class_name)

        if not os.path.isdir(class_path):
            continue

        images = [
            f for f in os.listdir(class_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp"))
        ]

        random.shuffle(images)

        total = len(images)

        train_end = int(total * TRAIN_RATIO)
        val_end = train_end + int(total * VAL_RATIO)

        train_imgs = images[:train_end]
        val_imgs = images[train_end:val_end]
        test_imgs = images[val_end:]

        # Create destination folders
        for split in ["train", "val", "test"]:
            os.makedirs(os.path.join(OUTPUT_DIR, split, class_name), exist_ok=True)

        # Copy Train
        for img in train_imgs:
            shutil.copy2(
                os.path.join(class_path, img),
                os.path.join(OUTPUT_DIR, "train", class_name, img)
            )

        # Copy Validation
        for img in val_imgs:
            shutil.copy2(
                os.path.join(class_path, img),
                os.path.join(OUTPUT_DIR, "val", class_name, img)
            )

        # Copy Test
        for img in test_imgs:
            shutil.copy2(
                os.path.join(class_path, img),
                os.path.join(OUTPUT_DIR, "test", class_name, img)
            )

        print(f"{class_name}: "
              f"Train={len(train_imgs)}, "
              f"Val={len(val_imgs)}, "
              f"Test={len(test_imgs)}")

print("\nDataset split completed successfully!")