from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

app = Flask(__name__)
CORS(app)

# Load your trained model
model = tf.keras.models.load_model("best_resnet_model.keras")

# Must match the order used during training
class_names = ["Fresh_Fruits", "Fresh_Vegetables", "Rotten_Fruits", "Rotten_Vegetables"]

# Save uploads OUTSIDE the project folder so Live Server doesn't auto-refresh
UPLOAD_FOLDER = os.path.join(os.path.expanduser("~"), "food_freshness_uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    img = image.load_img(filepath, target_size=(224, 224))
    arr = np.expand_dims(image.img_to_array(img), 0)   # NO /255.0 — matches training preprocessing
    pred = model.predict(arr)
    predicted_class = class_names[np.argmax(pred)]
    confidence = float(np.max(pred))

    if "Rotten" in predicted_class:
        shelf_life = "Expired"
    else:
        shelf_life = "3-5 days"

    return jsonify({
        "prediction": predicted_class,
        "confidence": f"{confidence:.2%}",
        "shelf_life": shelf_life
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)