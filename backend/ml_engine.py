import os
import zipfile
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras import layers, models
from PIL import Image

MODEL_KERAS_PATH = r"d:\foodfreshness\model\Food_Freshness_ResNet50.keras"
WEIGHTS_PATH = r"d:\foodfreshness\model\model.weights.h5"

# 36 Class Names (Alphabetical List matching the folders in the dataset)
CLASSES = [
    'Apple_Fresh', 'Apple_Rotten', 'Banana_Fresh', 'Banana_Rotten',
    'Bellpepper_Fresh', 'Bellpepper_Rotten', 'Bitter_Gourd_Fresh', 'Bitter_Gourd_Rotten',
    'Carrot_Fresh', 'Carrot_Rotten', 'Cucumber_Fresh', 'Cucumber_Rotten',
    'Grapes_Fresh', 'Grapes_Rotten', 'Guava_Fresh', 'Guava_Rotten',
    'Jujube_Fresh', 'Jujube_Rotten', 'Kaki_Fresh', 'Kaki_Rotten',
    'Lime_Fresh', 'Lime_Rotten', 'Mango_Fresh', 'Mango_Rotten',
    'Orange_Fresh', 'Orange_Rotten', 'Pomegranate_Fresh', 'Pomegranate_Rotten',
    'Potato_Fresh', 'Potato_Rotten', 'Strawberry_Fresh', 'Strawberry_Rotten',
    'Tomato_Fresh', 'Tomato_Rotten', 'Watermelon_Fresh', 'Watermelon_Rotten'
]

# Global model instance
model = None

def load_ml_model():
    global model
    if model is not None:
        return model

    # Extract weights if needed
    if not os.path.exists(WEIGHTS_PATH):
        print("[ML Engine] Extracting weights from .keras archive...")
        with zipfile.ZipFile(MODEL_KERAS_PATH, 'r') as zip_ref:
            zip_ref.extract('model.weights.h5', path=r"d:\foodfreshness\model")
        print("[ML Engine] Extraction complete.")

    # Reconstruct ResNet50 model
    print("[ML Engine] Reconstructing model architecture...")
    base_model = ResNet50(weights=None, include_top=False, input_shape=(224, 224, 3))
    x = base_model.output
    x = layers.GlobalAveragePooling2D(name='global_average_pooling2d')(x)
    x = layers.Dropout(0.4, name='dropout')(x)
    x = layers.Dense(512, activation='relu', name='dense')(x)
    x = layers.Dropout(0.3, name='dropout_1')(x)
    predictions = layers.Dense(36, activation='softmax', name='dense_1')(x)
    
    model = models.Model(inputs=base_model.input, outputs=predictions)

    # Load weights manually from Keras 3 format H5 into Keras 2 layers
    print("[ML Engine] Loading weights into model...")
    import h5py
    with h5py.File(WEIGHTS_PATH, 'r') as f:
        layers_group = f['layers']
        
        # Group models layers by type
        model_conv_layers = []
        model_bn_layers = []
        model_dense_layers = []
        
        for layer in model.layers:
            if isinstance(layer, layers.Conv2D):
                model_conv_layers.append(layer)
            elif isinstance(layer, layers.BatchNormalization):
                model_bn_layers.append(layer)
            elif isinstance(layer, layers.Dense):
                model_dense_layers.append(layer)
                
        # Group H5 keys
        h5_conv_keys = []
        h5_bn_keys = []
        h5_dense_keys = []
        
        for key in layers_group.keys():
            if key.startswith('conv2d'):
                h5_conv_keys.append(key)
            elif key.startswith('batch_normalization'):
                h5_bn_keys.append(key)
            elif key.startswith('dense'):
                h5_dense_keys.append(key)
                
        def get_index(k):
            parts = k.split('_')
            if len(parts) == 1 or parts[-1].isalpha():
                return 0
            try:
                return int(parts[-1])
            except ValueError:
                return 0
                
        h5_conv_keys = sorted(h5_conv_keys, key=get_index)
        h5_bn_keys = sorted(h5_bn_keys, key=get_index)
        h5_dense_keys = sorted(h5_dense_keys, key=get_index)
        
        # Map Conv2D
        for ml, hl in zip(model_conv_layers, h5_conv_keys):
            vars_group = layers_group[hl]['vars']
            keys = sorted(vars_group.keys(), key=lambda x: int(x))
            weights = [vars_group[k][()] for k in keys]
            ml.set_weights(weights)
            
        # Map BN
        for ml, hl in zip(model_bn_layers, h5_bn_keys):
            vars_group = layers_group[hl]['vars']
            keys = sorted(vars_group.keys(), key=lambda x: int(x))
            weights = [vars_group[k][()] for k in keys]
            ml.set_weights(weights)
            
        # Map Dense
        for ml, hl in zip(model_dense_layers, h5_dense_keys):
            vars_group = layers_group[hl]['vars']
            keys = sorted(vars_group.keys(), key=lambda x: int(x))
            weights = [vars_group[k][()] for k in keys]
            ml.set_weights(weights)
            
    print("[ML Engine] Model loaded successfully.")
    return model

def analyze_image_properties(img: Image.Image):
    """
    Computes computer-vision metrics:
    - Color degradation (browning/dark spots detection)
    - Texture changes (smoothness vs wrinkles/fuzziness)
    - Bruising / damage detection
    - Mold detection
    """
    # Convert image to numpy array
    arr = np.array(img.convert('RGB'))
    h, w, c = arr.shape
    total_pixels = h * w
    
    # 1. Color Analysis (Browning/Rotting)
    # Brown/black pixels generally have low intensity and R > G > B
    # Let's compute average red, green, and blue ratios
    r = arr[:, :, 0].astype(float)
    g = arr[:, :, 1].astype(float)
    b = arr[:, :, 2].astype(float)
    
    # Browning condition: Red is higher than green, and green is higher than blue, 
    # but they are not too bright (rot/decay) and have some saturation
    brown_mask = (r > g * 1.1) & (g > b * 1.05) & (r < 180) & (b < 100)
    brown_pixels = np.sum(brown_mask)
    color_degradation = float(brown_pixels / total_pixels)
    
    # Ensure color degradation is scaled nicely (0.0 to 0.8)
    color_degradation = min(color_degradation * 3.0, 1.0)
    
    # 2. Texture Analysis (Sharp edges / Wrinkles / Decay)
    # Standard deviation of gray scale image gives a crude measure of texture variance
    gray = (0.2989 * r + 0.5870 * g + 0.1140 * b)
    texture_var = np.std(gray)
    # A fresh product has a clean texture (higher std due to bright colors/shapes, or lower if smooth)
    # We will compute texture change as variance deviation
    # Normal fresh texture variance is around 30 to 70. 
    # Let's map texture change based on standard deviation
    texture_change = float(abs(45 - texture_var) / 45)
    texture_change = min(max(texture_change - 0.1, 0.0), 1.0)
    
    # 3. Mold Detection (gray/blue-green fuzzy spots)
    # Mold colors: low saturation, gray/greenish
    gray_spots = (np.abs(r - g) < 15) & (np.abs(g - b) < 15) & (g > 100) & (g < 190)
    mold_pixels = np.sum(gray_spots)
    mold_ratio = mold_pixels / total_pixels
    mold_detected = bool(mold_ratio > 0.08)
    
    # 4. Bruising Detection (dark isolated circular regions)
    # Low brightness spots
    dark_spots = (r < 80) & (g < 70) & (b < 60) & (r > 20)
    bruise_ratio = np.sum(dark_spots) / total_pixels
    bruising_detected = bool(bruise_ratio > 0.10)
    
    # 5. Physical Damage
    # High local variance (cracks/tears)
    physical_damage_detected = bool(texture_change > 0.45)
    
    # Calculate spoilage probability
    spoilage_prob = (color_degradation * 0.4 + texture_change * 0.3 + 
                      (0.3 if mold_detected else 0.0) + (0.2 if bruising_detected else 0.0))
    spoilage_prob = min(max(spoilage_prob, 0.0), 1.0)
    
    return {
        "color_degradation": round(color_degradation, 3),
        "texture_change": round(texture_change, 3),
        "mold_detected": mold_detected,
        "bruising_detected": bruising_detected,
        "physical_damage_detected": physical_damage_detected,
        "spoilage_prob": round(spoilage_prob, 3)
    }

def run_inference(image_path: str):
    """
    Loads image, detects class using Keras model, performs color/texture analysis,
    and returns a full diagnostic report.
    """
    # 1. Load ML Model
    ml_model = load_ml_model()
    
    # 2. Read Image
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")
        
    img = Image.open(image_path)
    
    # 3. Preprocess for ResNet50
    img_resized = img.resize((224, 224))
    img_arr = np.array(img_resized.convert('RGB')).astype(np.float32)
    img_expanded = np.expand_dims(img_arr, axis=0)
    img_preprocessed = preprocess_input(img_expanded)
    
    # 4. Predict Food Category & State
    predictions = ml_model.predict(img_preprocessed)
    class_idx = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][class_idx])
    predicted_class = CLASSES[class_idx]
    
    # Parse category and fresh/rotten state
    parts = predicted_class.split('_')
    is_fresh = parts[-1].lower() == 'fresh'
    food_category = "_".join(parts[:-1]).lower()
    
    # 5. Compute Visual Degradation Metrics
    metrics = analyze_image_properties(img)
    
    # Integrate model prediction with CV metrics
    if not is_fresh:
        # Model predicted Rotten: Spoilage probability should be high (at least 0.75)
        metrics["spoilage_prob"] = max(metrics["spoilage_prob"], 0.75)
    else:
        # Model predicted Fresh: Spoilage probability should be low (max 0.25) unless decay detected
        if not metrics["mold_detected"] and not metrics["bruising_detected"]:
            metrics["spoilage_prob"] = min(metrics["spoilage_prob"], 0.25)
            
    # 6. Calculate Freshness Score
    freshness_score = 100.0 * (1.0 - metrics["spoilage_prob"])
    
    # Classify quality
    if freshness_score >= 85:
        quality_class = "Fresh"
    elif freshness_score >= 70:
        quality_class = "Good"
    elif freshness_score >= 50:
        quality_class = "Acceptable"
    elif freshness_score >= 25:
        quality_class = "Near Spoilage"
    else:
        quality_class = "Spoiled"
        
    return {
        "category": food_category,
        "confidence": round(confidence, 3),
        "freshness_score": round(freshness_score, 1),
        "quality_class": quality_class,
        "spoilage_prob": metrics["spoilage_prob"],
        "color_degradation": metrics["color_degradation"],
        "texture_change": metrics["texture_change"],
        "mold_detected": metrics["mold_detected"],
        "bruising_detected": metrics["bruising_detected"],
        "physical_damage_detected": metrics["physical_damage_detected"]
    }
