from flask import Flask
from api.routes import ontology_api
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(ontology_api)


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
