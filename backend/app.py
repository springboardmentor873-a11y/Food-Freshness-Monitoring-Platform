from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from predict import predict_image

app = FastAPI()

# React frontend ko allow karne ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Development ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Food Freshness Detection API is Running"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    image = Image.open(io.BytesIO(image_bytes))

    result = predict_image(image)

    return result