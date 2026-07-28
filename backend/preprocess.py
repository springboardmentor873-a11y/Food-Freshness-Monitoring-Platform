from PIL import Image
import numpy as np

def preprocess_image(image: Image.Image, target_size=(224, 224)):
    """
    Preprocess the uploaded image for the EfficientNetB0 model.
    """
    # Convert to RGB if needed
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    # Resize to expected input size
    image = image.resize(target_size)
    
    # Convert to numpy array
    img_array = np.array(image, dtype=np.float32)
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    # Standard EfficientNet models in keras handle normalization internally
    # But if the specific model expects [0, 1] we can normalize, usually they expect [0, 255]
    # We will assume [0, 255] is fine for keras efficientnet which has a rescaling layer.
    
    return img_array
