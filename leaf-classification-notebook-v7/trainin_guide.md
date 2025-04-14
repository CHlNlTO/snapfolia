
---

# Dataset Preparation and Model Training Guide

### 1. **Split the Raw Dataset**
   - You will first split your cleaned dataset into training and test sets with an **80/20 ratio**. 
   - Use the script `dataset_cls_splitter.ipynb` for this task.
   
   Steps:
   - Open `dataset_cls_splitter.ipynb`.
   - Run the notebook to split the dataset.
   - Make sure the train-test split is **80/20**.

### 2. **Balance the Dataset**
   - After splitting, balance the dataset to ensure the training and test sets are suitable for model training.
   - Use the script `dataset_balancer_cls.ipynb` for this step.

   Steps:
   - Open `dataset_balancer_cls.ipynb`.
   - Run the script to balance the dataset, ensuring the following sizes:
     - **Training set**: `<= 300 images`
     - **Test set**: `<= 75 images`
   
### 3. **Generate Zoom-Out Dataset**
   - Next, generate a zoom-out abd zom-in version of the dataset. Create two folders: `TRAIN_ZOOM_OUT_CLS` and `TEST_ZOOM_IN_CLS`.
   - The training set should contain **175 images**, and the test set should contain **50 images**.
   - Look for the **random zoom-out** part in the script `dataset_generator_cls.ipynb`.

   Steps:
   - Open `dataset_generator_cls.ipynb`.
   - Find and run the section for generating zoom-out images.
   - Ensure the following number of images in each folder:
   - `175 images` for training and `50 images` for testing.
   - Input dataset path
   
### 4. **Generate Zoom-In Dataset**
   - Now, use the balanced training and test & training sets from **Step 2** to generate a zoom-in version of the dataset.
   - The **training set** should have **350 images**, and the **test set** should have **100 images**.
   - Look for the **random zoom-in** section in `dataset_generator_cls.ipynb` and adjust the script to point to the correct dataset location.
   
   Steps:
   - Open `dataset_generator_cls.ipynb`.
   - Find and run the section for generating zoom-in images.
   - Make sure to update the paths to use the balanced dataset created in **Step 2**.
   - Ensure the following:
   - `350 images` for training and `100 images` for testing.
   - Input dataset path

### 5. **Combine the Datasets**
   - Now that you have the zoom-in and zoom-out datasets, combine them.
   - Copy the **zoom-out dataset** to the **balanced training and test dataset** (from **Step 2**).

   Steps:
   - Copy the contents of the `TRAIN_ZOOM_OUT` folder into the **training set** from **Step 2**.
   - Copy the `TEST_ZOOM_OUT` test images into the **test set**.
   
### 6. **Augment the Combined Dataset**
   - Once combined, augment the dataset to meet the final required size.
   - The **final dataset** sizes should be:
     - **Training set**: `525 images`
     - **Test set**: `150 images`
   
   - The **final dataset** should have the following sizes:
     - **Training set**: `1050 images`
     - **Test set**: `300 images`

### 8. **Train the Model**
   - Finally, train your model with the processed dataset.
---

### Summary of Folder Structure After Processing:

- `TRAIN_ZOOM_OUT/`: Contains `175` training images and `50` test images.
- `TRAIN_ZOOM_IN/`: Contains `350` training images and `100` test images.
- Combined dataset should be in the following structure:
  - **Training set**: `525` images after combining and augmenting.
  - **Test set**: `150` images after combining and augmenting.
  
- **Final Count**:
  - **Training set**: `1050` images.
  - **Test set**: `300` images.

---