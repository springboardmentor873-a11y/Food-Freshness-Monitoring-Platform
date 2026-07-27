import os
import shutil
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from predict import predict_image

app = FastAPI(
    title="Food Freshness Monitoring API",
    description="API for detecting whether fruits and vegetables are Fresh or Rotten.",
    version="1.0.0"
)

# Enable CORS (React frontend will use this later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Restrict this later in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Food Freshness Monitoring API"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model": "loaded"
    }

# Directory to temporarily store uploaded images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Accepts an uploaded image, saves it temporarily, 
    runs the ML prediction, and cleans up the file afterwards.
    """
    # 1. Basic validation
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        
    # Generate a unique filename to prevent overwriting
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        # 2. Save the image temporarily inside the uploads folder
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 3. Call prediction logic
        prediction = predict_image(file_path)
        
        # 4. Return the prediction JSON or raise an error if one occurred inside the model
        if "error" in prediction:
            raise HTTPException(status_code=500, detail=prediction["error"])
            
        return prediction
        
    except HTTPException:
        # Let FastAPI HTTP exceptions pass through
        raise
    except Exception as e:
        # Catch unexpected errors and return as a 500 response
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
        
    finally:
        # 5. Delete the uploaded image after prediction, even if an error occurs
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Warning: Failed to delete temporary file {file_path}. Error: {e}")
