---

# Object Detection Dataset Preparation and Model Training Guide

---

### Prepare Raw Dataset for Object Detection First

Ensure your dataset follows this structure:

```
Folder/
├── images/
└── labels/
```

Once structured, proceed with dataset preparation using `Object-Detection-Data-Generator_final.ipynb`.

---

### 1. **Split the Dataset**
- This step splits your dataset into training and validation sets.
- Update `base_dir` with the path to your dataset folder.

**Resulting structure:**
```
Folder/
├── train/
│   ├── images/
│   └── labels/
└── val/
    ├── images/
    └── labels/
```

---

### 2. **Data Count Visualization (Optional but Recommended)**
- Visualizes class distributions.
- Update `train_dir` and `val_dir` accordingly.

---

### 3. **Generate Zoom-out for Train Dataset**
- Balances the training set to avoid class bias.
- Target count per class: `175`
- Output goes to `dsout/train`
- Update `dataset_path` to your train folder.

---

### 4. **Generate Zoom-out for Validation Dataset**
- Same as above but for validation.
- Target count per class: `50`
- Output goes to `dsout/val`
- Update `dataset_path` to your val folder.

---

### 5. **Visualize Zoom-out Datasets**
- Update `train_dir` to `dsout/train` or `dsout/val`.

---

### 6. **Generate Random Zoom-in for Training Dataset**
- Enhances dataset diversity.
- Target count per class: `350`
- Update `dataset_path` to your train folder.

---

### 6.1 **Visualize Zoom-in Train Dataset (Optional)**
- Helps assess the quality of zoom-ins.

---

### 7. **Generate Random Zoom-in for Validation Dataset**
- Target count per class: `100`
- Update `dataset_path` to your val folder.

---

### 7.1 **Visualize Zoom-in Validation Dataset (Optional)**

---

### 8. **Extra Data Clean-Up for Validation Dataset**
- Removes excess images per class.
- Update `base_path` to your val folder.

---

### 9. **Extra Data Clean-Up for Training Dataset**
- Same as Step 8 but for train folder.
- Update `base_path` accordingly.

---

### 10. **Train/Val Data Count After Cleanup**
- Confirms class balance after cleanup.

---

### 11. **Combine Zoom-in and Zoom-out Datasets**
- Merge `dsout/train` with `zoom-in train`, and `dsout/val` with `zoom-in val`.
- Update:
  - `src_train_dir` = `dsout/train`
  - `src_val_dir` = `dsout/val`
  - `dest_train_dir` = original train folder
  - `dest_val_dir` = original val folder

---

### 12. **Generate Rotations for Train and Val Datasets**
- Adds rotational augmentation to prevent angle-based bias.
- Target count:
  - Train: `525`
  - Val: `300`
- Update `train_dir` for each dataset.

---

### 13. **Visualize Final Augmented Datasets**
- Confirms that augmentation succeeded.

---

### 14. **Plot Random Samples (Optional)**
- Useful to inspect randomly chosen samples.

---

### 15. **Plot Specific Images (Optional)**
- Debug specific images or classes.

---

### 16. **Restructure Final Dataset for Training**
- Creates final YOLO-ready structure:

```
final_dataset/
├── train/
│   ├── images/
│   └── labels/
└── val/
    ├── images/
    └── labels/
```

- Update `source_dir` to the current dataset folder.
- Set `dest_dir` to a new folder name.
- Update the `range` according to the number of classes (refer to `data.yaml`).

---

### 17. **Train using YOLOv8**
- Set `data` argument in YOLOv8 to your YAML file path.
- `data.yaml` contains:
  - Class names
  - Train/val dataset paths

⚠️ Always keep your `data.yaml` updated when you modify or generate new data.

---