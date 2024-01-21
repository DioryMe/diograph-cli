import os

def join_with_user_home(path):
    user_home = os.path.expanduser("~")
    return os.path.join(user_home, path)
