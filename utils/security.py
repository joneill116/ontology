"""
Rate limiting and brute-force protection for Flask routes.
"""
import time
from flask import request, jsonify
from functools import wraps

# Simple in-memory store for demonstration (use Redis/memcached for production)
RATE_LIMITS = {}
BRUTE_FORCE = {}

RATE_LIMIT = 100  # requests per window
RATE_WINDOW = 60  # seconds
BRUTE_FORCE_LIMIT = 5  # failed logins per window
BRUTE_FORCE_WINDOW = 300  # seconds


def rate_limit(route_key=None):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.remote_addr or 'unknown'
            key = f"{route_key or f.__name__}:{ip}"
            now = int(time.time())
            window_start = now - RATE_WINDOW
            # Clean up old entries
            RATE_LIMITS.setdefault(key, []).append(now)
            RATE_LIMITS[key] = [t for t in RATE_LIMITS[key] if t > window_start]
            if len(RATE_LIMITS[key]) > RATE_LIMIT:
                return jsonify({"error": "Rate limit exceeded. Try again later."}), 429
            return f(*args, **kwargs)
        return wrapped
    return decorator


def brute_force_protect(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        ip = request.remote_addr or 'unknown'
        key = f"login:{ip}"
        now = int(time.time())
        window_start = now - BRUTE_FORCE_WINDOW
        BRUTE_FORCE.setdefault(key, []).append(now)
        BRUTE_FORCE[key] = [t for t in BRUTE_FORCE[key] if t > window_start]
        if len(BRUTE_FORCE[key]) > BRUTE_FORCE_LIMIT:
            return jsonify({"error": "Too many failed login attempts. Try again later."}), 429
        return f(*args, **kwargs)
    return wrapped
