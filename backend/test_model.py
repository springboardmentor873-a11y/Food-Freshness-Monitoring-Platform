import os
import numpy as np
from PIL import Image
import sys

from model_loader import get_model
from preprocess import preprocess_image

model = get_model()

files = [
    r"..\test\FreshBanana (14)_1.jpg.jpeg",
    r"..\test\freshCarrot (197).jpg.jpeg",
    r"..\test\freshTomato (3)1.jpg.jpeg"
]

for f in files:
    if os.path.exists(f):
        img = Image.open(f)
        processed = preprocess_image(img)
        pred = model.predict(processed)[0][0]
        print(f"File: {os.path.basename(f)} => Model Sigmoid: {pred:.8f}")
    else:
        print(f"File not found: {f}")

