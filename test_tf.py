import tensorflow as tf

print("=" * 50)
print("TensorFlow Version:", tf.__version__)

print("\nAvailable Devices:")
print(tf.config.list_physical_devices())

print("\nGPU Available:", tf.config.list_physical_devices('GPU'))

print("=" * 50)
print("TensorFlow is working successfully!")