import os

def get_config_file_path():
    user_home = os.path.expanduser("~")
    return os.path.join(user_home, '.dcli')
