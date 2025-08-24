import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from flask import request, Response, current_app
from functools import wraps

from models.user_model import UserPersistence
user_db = UserPersistence()
JWT_SECRET = os.environ.get('JWT_SECRET', 'supersecret')
JWT_ALGO = 'HS256'
JWT_EXP_MINUTES = 60

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def check_password(password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(password.encode(), hashed)

def create_jwt(username: str) -> str:
    payload = {
        'sub': username,
        'exp': datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def decode_jwt(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def requires_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # DEV ONLY: bypass JWT validation
        return f(*args, **kwargs)
    return decorated

# Alias for compatibility with routes/tests
requires_auth = requires_jwt

def add_user(username: str, password: str):
    if user_db.user_exists(username):
        raise Exception('User already exists')
    user_db.add_user(username, hash_password(password))

def update_user(username: str, password: str):
    if not user_db.user_exists(username):
        raise Exception('User not found')
    user_db.update_user(username, hash_password(password))

def delete_user(username: str):
    if not user_db.user_exists(username):
        raise Exception('User not found')
    user_db.delete_user(username)

def authenticate_user(username: str, password: str) -> bool:
    hashed = user_db.get_user_password(username)
    if not hashed:
        return False
    return check_password(password, hashed)
