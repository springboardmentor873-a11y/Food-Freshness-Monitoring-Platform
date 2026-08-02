import tensorflow as tf
import numpy as np

CLASS_NAMES = [
    'Apple_Fresh', 'Apple_Rotten',
    'Banana_Fresh', 'Banana_Rotten',
    'Bellpepper_Fresh', 'Bellpepper_Rotten',
    'Bitter_Gourd_Fresh', 'Bitter_Gourd_Rotten',
    'Carrot_Fresh', 'Carrot_Rotten',
    'Cucumber_Fresh', 'Cucumber_Rotten',
    'Grape_Fresh', 'Grape_Rotten',
    'Grapes_Fresh', 'Grapes_Rotten',
    'Guava_Fresh', 'Guava_Rotten',
    'Jujube_Fresh', 'Jujube_Rotten',
    'Kaki_Fresh', 'Kaki_Rotten',
    'Lime_Fresh', 'Lime_Rotten',
    'Mango_Fresh', 'Mango_Rotten',
    'Orange_Fresh', 'Orange_Rotten',
    'Papaya_Fresh', 'Papaya_Rotten',
    'Peach_Fresh', 'Peach_Rotten',
    'Pear_Fresh', 'Pear_Rotten',
    'Pomegranate_Fresh', 'Pomegranate_Rotten',
    'Potato_Fresh', 'Potato_Rotten',
    'Strawberry_Fresh', 'Strawberry_Rotten',
    'Tomato_Fresh', 'Tomato_Rotten',
    'Watermelon_Fresh', 'Watermelon_Rotten'
]

model = tf.keras.models.load_model(
    "best_food_freshness_efficientnet.keras"
)

img = tf.keras.utils.load_img(
    "sample.jpg",
    target_size=(224, 224)
)

img_array = tf.keras.utils.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)

prediction = model.predict(img_array)

class_index = np.argmax(prediction[0])
confidence = np.max(prediction[0]) * 100

print("\nPrediction:", CLASS_NAMES[class_index])
print("Confidence:", round(confidence, 2), "%")