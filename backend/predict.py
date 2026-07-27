import tensorflow as tf
import numpy as np
from PIL import Image
from pathlib import Path

# Model Path
MODEL_PATH = Path("model") / "best_model.keras"

# Load Model
model = tf.keras.models.load_model(MODEL_PATH)

# Class Names
class_names = [
    "Apple_Fresh",
    "Apple_Rotten",
    "Banana_Fresh",
    "Banana_Rotten",
    "Carrot_Fresh",
    "Grapes_Fresh",
    "Grapes_Rotten",
    "Guava_Fresh",
    "Guava_Rotten",
    "Jujube_Fresh",
    "Jujube_Rotten",
    "Kaki_Fresh",
    "Kaki_Rotten",
    "Lime_Fresh",
    "Lime_Rotten",
    "Mango_Fresh",
    "Mango_Rotten",
    "Orange_Fresh",
    "Orange_Rotten",
    "Pomegranate_Fresh",
    "Pomegranate_Rotten",
    "Potato_Rotten",
    "Strawberry_Fresh",
    "Strawberry_Rotten",
    "Tomato_Fresh",
    "Tomato_Rotten",
    "Watermelon_Fresh"
]

def predict_image(image: Image.Image):

    image = image.convert("RGB")
    image = image.resize((224,224))

    img_array = np.array(image)

    img_array = np.expand_dims(img_array, axis=0)

    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

    prediction = model.predict(img_array, verbose=0)

    index = np.argmax(prediction)

    confidence = float(np.max(prediction) * 100)

    predicted_class = class_names[index]

    fruit = predicted_class.split("_")[0]

    status = predicted_class.split("_")[1]

    return {
        "fruit": fruit,
        "status": status,
        "confidence": round(confidence,2)
    }