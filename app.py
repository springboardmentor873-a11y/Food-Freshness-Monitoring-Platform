import streamlit as st
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

# Page config
st.set_page_config(page_title="Food Freshness Detector", page_icon="🍎", layout="centered")

# Custom CSS (🔥 UI upgrade)
st.markdown("""
    <style>
    .main {
        background-color: #0e1117;
    }
    .title {
        text-align: center;
        font-size: 40px;
        color: #00ffcc;
        font-weight: bold;
    }
    .subtitle {
        text-align: center;
        font-size: 18px;
        color: #bbbbbb;
        margin-bottom: 30px;
    }
    .result-box {
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown('<div class="title">🍎 Food Freshness Detection</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Upload an image to check if food is Fresh or Spoiled</div>', unsafe_allow_html=True)

# Load model
model = tf.keras.models.load_model("food_model.h5")

# Upload
uploaded_file = st.file_uploader("📤 Upload Image", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    img = image.load_img(uploaded_file, target_size=(224, 224))
    st.image(img, caption="📸 Uploaded Image", use_column_width=True)

    # Preprocess
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    prediction = model.predict(img_array)

    # Result
    if prediction[0][0] > 0.5:
        result = "❌ Spoiled"
        color = "#ff4b4b"
        confidence = prediction[0][0] * 100
    else:
        result = "✅ Fresh"
        color = "#00ff88"
        confidence = (1 - prediction[0][0]) * 100

    st.markdown(
        f'<div class="result-box" style="background-color:{color};">{result}</div>',
        unsafe_allow_html=True
    )

    st.progress(int(confidence))
    st.write(f"### Confidence: {confidence:.2f}%")

    # Extra info
    if result == "❌ Spoiled":
        st.warning("⚠️ This food may not be safe to consume.")
    else:
        st.success("✅ This food looks fresh and safe.")