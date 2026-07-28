from flask import Flask, render_template, request
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__)

# Upload folder
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Load trained model
model = tf.keras.models.load_model("food_freshness_model.keras")

# Class names
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

# Shelf Life Information
shelf_life = {

    "Apple_Fresh": ("20-30 days", "Store in refrigerator (0-4°C)"),
    "Apple_Rotten": ("0 days", "Discard immediately"),

    "Banana_Fresh_diverse": ("3-7 days", "Store at room temperature"),
    "Banana_Rotten": ("0 days", "Discard immediately"),

    "Carrot_Fresh": ("20-30 days", "Refrigerate in plastic bag"),

    "Grapefruit_Fresh": ("20-30 days", "Store in refrigerator"),
    "Grapefruit_Rotten": ("0 days", "Discard immediately"),

    "Grapes_Fresh": ("7-14 days", "Keep refrigerated"),
    "Grapes_Rotten": ("0 days", "Discard immediately"),

    "Guava_Fresh": ("3-5 days", "Store at room temperature"),
    "Guava_Rotten": ("0 days", "Discard immediately"),

    "Jujube_Fresh": ("7-10 days", "Store in refrigerator"),
    "Jujube_Rotten": ("0 days", "Discard immediately"),

    "Kaki_Fresh": ("5-7 days", "Keep refrigerated"),
    "Kaki_Rotten": ("0 days", "Discard immediately"),

    "Lime_Fresh": ("15-20 days", "Store in refrigerator"),
    "Lime_Rotten": ("0 days", "Discard immediately"),

    "Mango_Fresh": ("5-8 days", "Store at room temperature"),
    "Mango_Rotten": ("0 days", "Discard immediately"),

    "Orange_Fresh": ("15-20 days", "Store in refrigerator"),
    "Orange_Rotten": ("0 days", "Discard immediately"),

    "Pear_Fresh": ("5-7 days", "Keep refrigerated"),
    "Pear_Rotten": ("0 days", "Discard immediately"),

    "Pomegranate_Fresh": ("30-60 days", "Store in cool place"),
    "Pomegranate_Rotten": ("0 days", "Discard immediately"),

    "Potato_Rotten": ("0 days", "Discard immediately"),

    "Strawberry_Fresh": ("3-5 days", "Refrigerate"),
    "Strawberry_Rotten": ("0 days", "Discard immediately"),

    "Tomato_Fresh": ("5-7 days", "Store at room temperature"),
    "Tomato_Rotten": ("0 days", "Discard immediately"),

    "Watermelon_Fresh": ("7-10 days", "Keep refrigerated after cutting"),
    "Watermelon_Rotten": ("0 days", "Discard immediately")
}

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/upload")
def upload():
    return render_template("upload.html")


@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["image"]

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    image = Image.open(filepath).convert("RGB")
    image = image.resize((224, 224))

    img = np.array(image, dtype=np.float32)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    # Prediction
    prediction = model.predict(img)
    print("\n===== MODEL OUTPUT =====")
    print(prediction)
    print("Predicted Index:", np.argmax(prediction))
    print("Predicted Class:", class_names[np.argmax(prediction)])
    print("Confidence:", float(np.max(prediction)) * 100)
    print("========================\n")


    print("Prediction Array:", prediction)
    print("Highest Index:", np.argmax(prediction))
    print("Highest Probability:", np.max(prediction))

    index = np.argmax(prediction)

    result = class_names[index]

    print("Predicted Class:", result)

    confidence = round(float(np.max(prediction)) * 100, 2)

    days, storage = shelf_life.get(
        result,
        ("Unknown", "No recommendation")
    )

    return render_template(
        "result.html",
        prediction=result,
        confidence=confidence,
        image_path="uploads/" + file.filename,
        shelf_life=days,
        storage=storage
    )


@app.route("/history")
def history():
    return render_template("history.html")


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(debug=True)