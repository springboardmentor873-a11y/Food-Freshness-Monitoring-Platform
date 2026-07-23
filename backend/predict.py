import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input
from food_info import FOOD_INFO

# Define the absolute path to the model and class names
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "Food_Freshness_ResNet50.keras")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "class_names.json")

# Global variable to hold the loaded model
_model = None

def preprocess_image(image_path):
    """
    Preprocesses an image for the ResNet50 model.
    Steps: Load, resize, convert to array, expand dims, and apply ResNet50 preprocessing.
    """
    # Load the image from the given path and resize it to 224x224 pixels
    img = tf.keras.utils.load_img(image_path, target_size=(224, 224))
    
    # Convert the image into a NumPy array
    img_array = tf.keras.utils.img_to_array(img)
    
    # Expand the batch dimension (creates shape: 1, 224, 224, 3)
    img_batch = np.expand_dims(img_array, axis=0)
    
    # Apply TensorFlow ResNet50 preprocessing
    processed_image = preprocess_input(img_batch)
    
    # Return the processed image
    return processed_image

def load_model():
    """
    Loads the trained ResNet50 model from the file system.
    Handles errors and ensures it's only loaded once.
    """
    global _model
    
    # Only load the model if it hasn't been loaded already
    if _model is not None:
        return _model
        
    try:
        # Load the saved model
        _model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Failed to load the model. Please check if the file exists at: {MODEL_PATH}")
        print(f"Error details: {e}")
        _model = None
        
    return _model

def get_model():
    """
    Returns the loaded model instance. 
    """
    global _model

    if _model is None:
        _model = load_model()

    return _model

def load_class_names():
    """
    Reads the class names from the class_names.json file.
    Returns a list or dictionary of class names.
    """
    try:
        with open(CLASS_NAMES_PATH, 'r') as f:
            class_names = json.load(f)
        return class_names
    except Exception as e:
        print(f"Error loading class names from {CLASS_NAMES_PATH}: {e}")
        return None

def predict_image(image_path):
    """
    Preprocesses the image, makes a prediction using the loaded model,
    and returns the predicted class name and confidence score.
    """
    try:
        # 1. Get the loaded model
        model = get_model()
        if model is None:
            raise ValueError("Model is not loaded. Cannot perform prediction.")
            
        # 2. Get class names
        class_names = load_class_names()
        if class_names is None:
            raise ValueError("Class names could not be loaded.")
            
        # 3. Preprocess the image
        processed_img = preprocess_image(image_path)
        
        # 4. Predict using model.predict()
        predictions = model.predict(processed_img, verbose=0)
        
        # 5. Find the class with the highest probability
        # Assuming predictions is a 2D array: (1, num_classes)
        predicted_index = np.argmax(predictions, axis=1)[0]
        confidence = float(predictions[0][predicted_index])
        
        # 6. Calculate confidence percentage
        confidence_percentage = round(confidence * 100, 2)
        
        # 7. Get the corresponding class name
        # Depending on how class_names.json is structured (list or dict)
        if isinstance(class_names, dict):
            # If it's a dict mapping string index to class name
            class_name = class_names.get(str(predicted_index), "Unknown")
        else:
            # If it's a list
            class_name = class_names[predicted_index]
            
       # Split the class name into food name and freshness
        food_name, freshness = class_name.rsplit("_", 1)
        food_data = FOOD_INFO.get(food_name, {}).get(
            freshness,
            {
                "shelf_life": "Unknown",
                "storage": "Unknown",
                "recommendation": "No recommendation available.",
                "risk_level": "Unknown"
            }
        )

        # Return the prediction result
        return {
            "class_name": class_name,
            "food_name": food_name,
            "freshness": freshness,
            "confidence": confidence_percentage,

            "shelf_life": food_data["shelf_life"],
            "storage": food_data["storage"],
            "recommendation": food_data["recommendation"],
            "risk_level": food_data["risk_level"]
        }
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return {
            "error": str(e)
        }

# Load the model exactly once when this module is imported on application startup
load_model()
