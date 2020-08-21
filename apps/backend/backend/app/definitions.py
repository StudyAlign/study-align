import os

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(ROOT_DIR, 'uploads')
MODELS_DIR = os.path.join(UPLOAD_DIR, 'models')

if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)