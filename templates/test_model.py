import tensorflow as tf
import numpy as np
from PIL import Image

# Load model
model = tf.keras.models.load_model("food_freshness_model.keras")

# Same class names used in app.py
class_names = [
    "Apple_Fresh",
    "Apple_Rotten",
    "Banana_Fresh_diverse",
    "Banana_Rotten",
    "Carrot_Fresh",
    "Grapefruit_Fresh",
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
    "Pear_Fresh",
    "Pear_Rotten",
    "Pomegranate_Fresh",
    "Pomegranate_Rotten",
    "Potato_Rotten",
    "Strawberry_Fresh",
    "Strawberry_Rotten",
    "Tomato_Fresh",
    "Tomato_Rotten",
    "Watermelon_Fresh",
    "Watermelon_Rotten"
]

# Change this to the image you want to test
image = Image.open("static/uploads/freshCarrot (197).jpg").convert("RGB")
image = image.resize((224, 224))

img = np.array(image) / 255.0
img = np.expand_dims(img, axis=0)

prediction = model.predict(img)

print("Prediction Vector:")
print(prediction)

print("\nHighest Index:", np.argmax(prediction))
print("Predicted Class:", class_names[np.argmax(prediction)])
print("Confidence:", np.max(prediction) * 100)