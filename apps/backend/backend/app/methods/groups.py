import uuid

from decouple import config
from os import path

def get_group_logo_path(slug: str):
    logos_path = config('LOGOS_PATH')
    return path.join(logos_path, 'groups', slug + ".png")