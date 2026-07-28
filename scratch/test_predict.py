import sys
import os
from PIL import Image

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from predict import make_prediction

# Create a dummy image
img = Image.new('RGB', (100, 100), color = 'red')

try:
    print(make_prediction(img))
except Exception as e:
    import traceback
    traceback.print_exc()
