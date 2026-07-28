import numpy as np
from preprocess import preprocess_image
from model_loader import get_model

# Default classes - we will map based on probability index
CLASS_NAMES = ["Fresh", "Rotten"] 

def guess_fruit_by_color(image):
    try:
        # Convert image to RGB and resize to 32x32 for fast processing
        img = image.convert("RGB").resize((32, 32))
        pixels = np.array(img) # shape: (32, 32, 3)
        pixels = pixels.reshape(-1, 3)
        
        r = pixels[:, 0].astype(float)
        g = pixels[:, 1].astype(float)
        b = pixels[:, 2].astype(float)
        
        # Color masks
        # Yellow (high R, high G, low B)
        yellow_mask = (r > 140) & (g > 140) & (b < 110)
        # Red (high R, low G, low B)
        red_mask = (r > 130) & (g < 95) & (b < 95)
        # Green (low R, high G, low B)
        green_mask = (g > 90) & (r < 130) & (b < 130)
        # Orange (high R, medium G, low B)
        orange_mask = (r > 170) & (g > 85) & (g < 170) & (b < 90)
        
        num_yellow = np.sum(yellow_mask)
        num_red = np.sum(red_mask)
        num_green = np.sum(green_mask)
        num_orange = np.sum(orange_mask)
        
        print(f"COLOR CLASSIFIER counts: red={num_red}, yellow={num_yellow}, green={num_green}, orange={num_orange}")
        
        # 1. Watermelon: Red pulp + green rind (often has both red and green in slice)
        if num_red > 40 and num_green > 20:
            return "Watermelon"
            
        # 2. Broccoli / Cucumber / Avocado: mostly green
        if num_green > 80 and num_green > num_yellow and num_green > num_red:
            green_pixels = pixels[green_mask]
            avg_green_val = np.mean(green_pixels) if len(green_pixels) > 0 else 128
            if avg_green_val < 75:
                return "Avocado"
            return "Cucumber"
            
        # 3. Orange / Carrot: mostly orange
        if num_orange > 80 and num_orange > num_red and num_orange > num_yellow:
            return "Orange"
            
        # 4. Banana / Lemon: mostly yellow
        if num_yellow > 80 and num_yellow > num_red and num_yellow > num_green:
            return "Banana"
            
        # 5. Tomato / Strawberry / Apple: mostly red
        if num_red > 80:
            return "Tomato"
            
    except Exception as e:
        print(f"Error guessing fruit by color: {e}")
    return None

def make_prediction(image, fruit_name="Banana"):
    model = get_model()
    processed_image = preprocess_image(image)
    
    # If the fruit name is generic, try to guess it from the pixel colors
    if fruit_name in ["Fruit", "Vegetable", "Banana"]:
        guessed = guess_fruit_by_color(image)
        if guessed:
            fruit_name = guessed
            
    predictions = model.predict(processed_image)
    val = float(predictions[0][0])
    
    # Sigmoid binary classification: 0 = Fresh, 1 = Rotten
    if val > 0.5:
        freshness_status = "Rotten"
        confidence = val * 100.0
        class_id = 1
    else:
        freshness_status = "Fresh"
        confidence = (1.0 - val) * 100.0
        class_id = 0
        
    return {
        "fruit": fruit_name,
        "freshness": freshness_status,
        "confidence": round(confidence, 2),
        "class_id": class_id,
        "all_probabilities": [val]
    }
