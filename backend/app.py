import os
import sys
import io
import base64
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image

from model_service import model_service
from freshness_engine import analyze_visual_features, calculate_shelf_life, generate_recommendations
from inventory_store import inventory_store

app = Flask(__name__, static_folder='samples')
CORS(app)

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'samples')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "AI Food Freshness Monitoring API",
        "model_loaded": model_service.model is not None,
        "supported_classes": 4
    })

@app.route('/api/classify', methods=['POST'])
def classify_food_image():
    """Classifies uploaded food image or base64 image data"""
    try:
        temp_c = float(request.form.get('temperature', 4.0))
        humidity_pct = float(request.form.get('humidity', 85.0))
        
        image = None
        
        # 1. File Upload
        if 'image' in request.files:
            file = request.files['image']
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
        # 2. JSON Base64 Data
        elif request.is_json and 'image_base64' in request.json:
            b64_data = request.json['image_base64']
            if ',' in b64_data:
                b64_data = b64_data.split(',')[1]
            image_bytes = base64.b64decode(b64_data)
            image = Image.open(io.BytesIO(image_bytes))
            temp_c = float(request.json.get('temperature', 4.0))
            humidity_pct = float(request.json.get('humidity', 85.0))
            
        if image is None:
            return jsonify({"error": "No image provided. Please upload an image file or base64 string."}), 400

        # Run Model Inference
        pred_res = model_service.predict(image)
        class_idx = pred_res["class_index"]
        
        # Run Feature & Degradation Analysis
        visual_features = analyze_visual_features(image, pred_res["verdict"], class_idx)
        
        # Run Shelf Life Calculation with continuous visual features & probabilities
        shelf_life = calculate_shelf_life(
            class_idx,
            pred_res["category"],
            temp_c,
            humidity_pct,
            visual_features=visual_features,
            probs=pred_res["probabilities"]
        )
        
        # Calculate Final Weighted Freshness Score (0-100)
        # Visual (40%), Storage (25%), Model (20%), Age (15%)
        base_score = pred_res["base_score"]
        visual_penalty = (visual_features["color_degradation"] * 0.25 + visual_features["mold_probability"] * 0.4)
        freshness_score = max(0, min(100, int(round(base_score - visual_penalty * 0.4))))
        
        # Recommendations
        recommendations = generate_recommendations(class_idx, visual_features, shelf_life)

        result = {
            "verdict": pred_res["verdict"],
            "status": pred_res["status"],
            "category": pred_res["category"],
            "confidence": round(pred_res["confidence"] * 100, 1),
            "freshness_score": freshness_score,
            "visual_features": visual_features,
            "shelf_life": shelf_life,
            "recommendations": recommendations,
            "probabilities": [round(p * 100, 1) for p in pred_res["probabilities"]]
        }

        return jsonify(result)

    except Exception as e:
        print(f"[API Error] /api/classify failed: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/samples/<filename>')
def serve_sample_image(filename):
    return send_from_directory(SAMPLES_DIR, filename)

@app.route('/api/sample-presets', methods=['GET'])
def get_sample_presets():
    presets = [
        {
            "id": "sample-fresh-apple",
            "name": "Fresh Organic Red Apple",
            "filename": "fresh_apple.jpg",
            "url": "http://localhost:5000/api/samples/fresh_apple.jpg",
            "expected": "GOOD TO EAT"
        },
        {
            "id": "sample-fresh-tomato",
            "name": "Fresh Vine Tomato",
            "filename": "fresh_tomato.jpg",
            "url": "http://localhost:5000/api/samples/fresh_tomato.jpg",
            "expected": "GOOD TO EAT"
        },
        {
            "id": "sample-spoiled-banana",
            "name": "Overripe Brown Banana",
            "filename": "spoiled_banana.jpg",
            "url": "http://localhost:5000/api/samples/spoiled_banana.jpg",
            "expected": "EAT IMMEDIATELY / NEAR SPOILED"
        },
        {
            "id": "sample-spoiled-orange",
            "name": "Spoiled Moldy Citrus",
            "filename": "spoiled_orange.jpg",
            "url": "http://localhost:5000/api/samples/spoiled_orange.jpg",
            "expected": "SPOILED"
        }
    ]
    return jsonify(presets)

@app.route('/api/inventory', methods=['GET', 'POST'])
def handle_inventory():
    if request.method == 'POST':
        item_data = request.json
        added_item = inventory_store.add_item(item_data)
        return jsonify({"success": True, "item": added_item})
    else:
        return jsonify(inventory_store.get_all())

@app.route('/api/inventory/<item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
    inventory_store.delete_item(item_id)
    return jsonify({"success": True, "deleted_id": item_id})

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    return jsonify(inventory_store.get_analytics())

@app.route('/api/simulate-env', methods=['POST'])
def simulate_env():
    data = request.json or {}
    class_idx = int(data.get('class_index', 0))
    temp_c = float(data.get('temperature', 4.0))
    humidity_pct = float(data.get('humidity', 85.0))
    
    category_names = {0: "Fresh", 1: "Good", 2: "Near Spoilage", 3: "Spoiled"}
    shelf_life = calculate_shelf_life(class_idx, category_names.get(class_idx, "Fresh"), temp_c, humidity_pct)
    return jsonify(shelf_life)

if __name__ == '__main__':
    print("[Flask] Starting Food Freshness Monitoring API Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
