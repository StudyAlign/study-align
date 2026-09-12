import os

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(ROOT_DIR, 'uploads')
MODELS_DIR = os.path.join(UPLOAD_DIR, 'models')
LOGOS_DIR = os.path.join(ROOT_DIR, 'logos')
GROUP_LOGOS_DIR = os.path.join(LOGOS_DIR, 'groups')
STUDY_LOGOS_DIR = os.path.join(LOGOS_DIR, 'studies')

if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

if not os.path.exists(LOGOS_DIR):
    os.makedirs(LOGOS_DIR)

if not os.path.exists(GROUP_LOGOS_DIR):
    os.makedirs(GROUP_LOGOS_DIR)

if not os.path.exists(STUDY_LOGOS_DIR):
    os.makedirs(STUDY_LOGOS_DIR)