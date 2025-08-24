from flask import request
# Ensure all OPTIONS requests return HTTP 200 for CORS preflight

from flask import Flask
from api.routes import create_ontology_api
from services.ontology_service import OntologyService
from config import Config
from flask_cors import CORS




app = Flask(__name__)
app.config.from_object(Config)
service = OntologyService()
ontology_api = create_ontology_api(service)
app.register_blueprint(ontology_api, url_prefix='/api')
CORS(app, supports_credentials=True, allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])


@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return '', 200

# Centralized error handling
@app.errorhandler(400)
def bad_request(error):
    return {"error": "Bad request", "message": str(error)}, 400

@app.errorhandler(404)
def not_found(error):
    return {"error": "Not found", "message": str(error)}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error", "message": str(error)}, 500

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])
