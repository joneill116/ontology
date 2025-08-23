from flask import jsonify, Response
from typing import Any, Optional

def success_response(data: Optional[Any] = None, status: int = 200) -> Response:
    """
    Return a standardized success response.
    """
    return jsonify({"status": "success", "data": data}), status

def error_response(message: str, status: int = 400) -> Response:
    """
    Return a standardized error response.
    """
    return jsonify({"status": "error", "error": message}), status
