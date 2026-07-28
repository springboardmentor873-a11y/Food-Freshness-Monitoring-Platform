import numpy as np
from pathlib import Path
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "FreshSense_EfficientNetB0.keras"

model = load_model(MODEL_PATH)

class_names = [
    "fresh_bread",
    "fresh_dairy",
    "fresh_fruits",
    "fresh_vegetables",
    "spoiled_bread",
    "spoiled_dairy",
    "spoiled_fruits",
    "spoiled_vegetables"
]


def predict_food(img_path):
    img = image.load_img(
        img_path,
        target_size=(224, 224),
        color_mode="rgb"
    )

    img_array = image.img_to_array(img)
    img_batch = np.expand_dims(img_array, axis=0)

    # Important:
    # EfficientNetB0 preprocessing is already included in the model.
    # Do not divide the image by 255 here.

    predictions = model.predict(img_batch, verbose=0)[0]

    predicted_index = int(np.argmax(predictions))
    predicted_class = class_names[predicted_index]
    confidence = float(predictions[predicted_index] * 100)

    all_probabilities = {
        class_names[i]: float(predictions[i] * 100)
        for i in range(len(class_names))
    }

    return predicted_class, confidence, all_probabilities