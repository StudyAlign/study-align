import os

from decouple import config

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(ROOT_DIR, 'uploads')
MODELS_DIR = os.path.join(UPLOAD_DIR, 'models')
# Derive the logo directories from the same LOGOS_PATH the runtime writes to
# (see methods/groups.get_group_logo_path), so the directories that get created
# here always match where the upload code actually stores files.
LOGOS_DIR = config('LOGOS_PATH')
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