from flask import Blueprint, request, jsonify, send_file, Response
from .auth import requires_auth
from .auth import add_user, update_user, delete_user, authenticate_user, create_jwt, requires_jwt
import tempfile
from utils.responses import success_response, error_response
from utils.logging import logger
from utils.validation import validate_class_data, validate_property_data, validate_constraint_data
from utils.security import rate_limit, brute_force_protect


def create_ontology_api(service):
    ontology_api = Blueprint('ontology_api', __name__)

    @ontology_api.route("/users", methods=["POST"])
    @rate_limit("create_user")
    def create_user():
        data = request.json
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return error_response("Username and password required", 400)
        try:
            add_user(username, password)
            return success_response(status=201)
        except Exception as e:
            return error_response(str(e), 400)

    @ontology_api.route("/users/<username>", methods=["PUT"])
    @rate_limit("update_user")
    def update_user_endpoint(username):
        data = request.json
        password = data.get("password")
        if not password:
            return error_response("Password required", 400)
        try:
            update_user(username, password)
            return success_response()
        except Exception as e:
            return error_response(str(e), 400)

    @ontology_api.route("/users/<username>", methods=["DELETE"])
    @rate_limit("delete_user")
    def delete_user_endpoint(username):
        try:
            delete_user(username)
            return success_response()
        except Exception as e:
            return error_response(str(e), 400)

    @ontology_api.route("/login", methods=["POST"])
    @rate_limit("login")
    @brute_force_protect
    def login():
        data = request.json
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return error_response("Username and password required", 400)
        if authenticate_user(username, password):
            token = create_jwt(username)
            return success_response({"token": token})
        else:
                return error_response("Invalid credentials", 401)

    @ontology_api.route("/classes", methods=["POST"])
    @rate_limit("add_class")
    @requires_jwt
    def add_class() -> Response:
        """
        Create a new ontology class.
        Expects JSON with 'name', optional 'label', 'comment', 'parent'.
        Returns: JSON response with status and error if any.
        """
        data = request.json
        error = validate_class_data(data)
        if error:
            logger.warning(f"Validation failed for class: {error}")
            return error_response(error, 400)
        try:
            service.add_class(
                name=data["name"].strip(),
                label=data.get("label"),
                comment=data.get("comment"),
                parent=data.get("parent")
            )
            logger.info(f"Class created: {data['name'].strip()}")
            return success_response(status=201)
        except Exception as e:
            logger.error(f"Error creating class: {e}", exc_info=True)
            return error_response(f"Internal error: {str(e)}", 500)

    @ontology_api.route("/properties", methods=["POST"])
    @rate_limit("add_property")
    @requires_jwt
    def add_property() -> Response:
        """
        Create a new ontology property.
        Expects JSON with 'name', 'type', optional 'domain', 'range', 'label', 'comment'.
        Returns: JSON response with status and error if any.
        """
        data = request.json
        error = validate_property_data(data)
        if error:
            logger.warning(f"Validation failed for property: {error}")
            return error_response(error, 400)
        try:
            service.add_property(
                name=data["name"].strip(),
                prop_type=data.get("type", "object"),
                domain=data.get("domain"),
                range_=data.get("range"),
                label=data.get("label"),
                comment=data.get("comment")
            )
            logger.info(f"Property created: {data['name'].strip()} type={data.get('type', 'object')}")
            return success_response(status=201)
        except Exception as e:
            logger.error(f"Error creating property: {e}", exc_info=True)
            return error_response(f"Internal error: {str(e)}", 500)

    @ontology_api.route("/constraints", methods=["POST"])
    @rate_limit("add_constraint")
    @requires_jwt
    def add_constraint() -> Response:
        """
        Add a constraint to an ontology class/property.
        Expects JSON with 'class', 'property', 'type', 'value'.
        Returns: JSON response with status and error if any.
        """
        data = request.json
        error = validate_constraint_data(data)
        if error:
            logger.warning(f"Validation failed for constraint: {error}")
            return error_response(error, 400)
        try:
            service.add_constraint(
                class_name=data["class"].strip(),
                prop_name=data["property"].strip(),
                constraint_type=data["type"],
                value=data["value"]
            )
            logger.info(f"Constraint added: class={data['class'].strip()} property={data['property'].strip()} type={data['type']} value={data['value']}")
            return success_response(status=201)
        except Exception as e:
            logger.error(f"Error adding constraint: {e}", exc_info=True)
            return error_response(f"Internal error: {str(e)}", 500)

    @ontology_api.route("/export", methods=["GET"])
    @rate_limit("export_ontology")
    @requires_jwt
    def export_ontology() -> Response:
        """
        Export the ontology in the requested format.
        Query param: 'format' (default 'turtle').
        Returns: File download or error JSON.
        """
        fmt = request.args.get("format", "turtle")
        try:
            data = service.export_ontology(fmt)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".ttl") as tmp:
                tmp.write(data.encode())
                tmp.close()
            logger.info(f"Ontology exported in format: {fmt}")
            return send_file(tmp.name, as_attachment=True, download_name=f"ontology.{fmt}")
        except Exception as e:
            logger.error(f"Error exporting ontology: {e}", exc_info=True)
            return error_response(str(e), 500)

    @ontology_api.route("/import", methods=["POST"])
    @rate_limit("import_ontology")
    @requires_jwt
    def import_ontology() -> Response:
        """
        Import ontology from uploaded file.
        Expects file upload and optional 'format'.
        Returns: JSON response with status and error if any.
        """
        if "file" not in request.files:
            return error_response("No file uploaded.", 400)
        file = request.files["file"]
        fmt = request.form.get("format", "turtle")
        try:
            service.import_ontology(file.stream, fmt)
            logger.info(f"Ontology imported from file: {file.filename} format={fmt}")
            return success_response(status=201)
        except Exception as e:
            logger.error(f"Error importing ontology: {e}", exc_info=True)
            return error_response(str(e), 500)


    @ontology_api.route("/classes", methods=["GET"])
    def get_classes() -> Response:
        """
        Get all ontology classes.
        Returns: JSON list of classes.
        """
        return success_response(service.get_classes(), status=200)

    @ontology_api.route("/properties", methods=["GET"])
    def get_properties() -> Response:
        """
        Get all ontology properties.
        Returns: JSON list of properties.
        """
        return success_response(service.get_properties(), status=200)

    return ontology_api

