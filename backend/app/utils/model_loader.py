import os
import time
import numpy as np
from PIL import Image
import tensorflow as tf
from app.config import settings

CLASS_NAMES = [
    "fresh_bread", "fresh_dairy", "fresh_fruits", "fresh_vegetables",
    "spoiled_bread", "spoiled_dairy", "spoiled_fruits", "spoiled_vegetables",
]

class ModelManager:
    _instance = None

    def __init__(self):
        self.model = None
        self.is_loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def load_model(self):
        if self.is_loaded and self.model is not None:
            return self.model

        model_path = settings.MODEL_PATH
        if not os.path.isabs(model_path):
            model_path = os.path.abspath(model_path)

        print(f"[MODEL] Loading EfficientNetB0 model from: {model_path}...")
        start_time = time.time()
        
        try:
            # Disable GPU logs if running on CPU or standard environment
            tf.config.set_visible_devices([], 'GPU')
        except Exception:
            pass

        self.model = tf.keras.models.load_model(model_path)
        load_time = time.time() - start_time
        self.is_loaded = True
        print(f"[MODEL] EfficientNetB0 loaded successfully in {load_time:.2f} seconds.")
        return self.model

    def preprocess_image(self, image_path_or_file) -> np.ndarray:
        """
        Resize image to 224x224 RGB as required by EfficientNetB0 input specifications.
        Returns a numpy array of shape (1, 224, 224, 3) in float32.
        """
        img = Image.open(image_path_or_file).convert("RGB")
        img = img.resize((224, 224), Image.Resampling.BILINEAR)
        img_array = np.array(img, dtype=np.float32)
        img_batch = np.expand_dims(img_array, axis=0)
        return img_batch

    def predict(self, image_path_or_file):
        """
        Runs model inference.
        Returns:
            predicted_class_name (str)
            confidence_score (float, 0-100)
            all_probabilities (dict)
            inference_time_ms (float)
        """
        if not self.is_loaded or self.model is None:
            self.load_model()

        start_time = time.time()
        img_batch = self.preprocess_image(image_path_or_file)
        
        preds = self.model.predict(img_batch, verbose=0)[0]
        inference_time_ms = round((time.time() - start_time) * 1000, 2)

        predicted_idx = int(np.argmax(preds))
        confidence = float(preds[predicted_idx]) * 100.0
        predicted_class = CLASS_NAMES[predicted_idx]

        probabilities = {CLASS_NAMES[i]: round(float(preds[i]) * 100.0, 2) for i in range(len(CLASS_NAMES))}

        return predicted_class, round(confidence, 2), probabilities, inference_time_ms

model_manager = ModelManager.get_instance()
