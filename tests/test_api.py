
import pytest
from flask import Flask, Response
from api.routes import create_ontology_api
from services.ontology_service import OntologyService
from unittest.mock import patch


# Patch requires_jwt and requires_auth to no-op BEFORE blueprint creation
import api.auth
def no_op_decorator(f):
    return f
api.auth.requires_jwt = no_op_decorator
api.auth.requires_auth = no_op_decorator
import jwt

class MockJWT:
    @staticmethod
    def encode(payload, secret, algorithm):
        return "mocked.jwt.token"

def get_jwt(client):
    # Return a mocked JWT token for tests
    return "mocked.jwt.token"

class MockOntologyService(OntologyService):
    def __init__(self):
        super().__init__()
        self.classes = []
        self.properties = []
        self.constraints = []
    def add_class(self, name, label=None, comment=None, parent=None):
        if name == "duplicate":
            raise Exception("Duplicate class")
        self.classes.append(name)
    def add_property(self, name, prop_type, domain=None, range_=None, label=None, comment=None):
        if name == "duplicate":
            raise Exception("Duplicate property")
        self.properties.append(name)
    def add_constraint(self, class_name, prop_name, constraint_type, value):
        if class_name == "missing":
            raise Exception("Class not found")
        self.constraints.append((class_name, prop_name, constraint_type, value))
    def get_classes(self):
        return self.classes
    def get_properties(self):
        return self.properties
    def export_ontology(self, fmt):
        return "@prefix : <#> ."
    def import_ontology(self, stream, fmt):
        pass

@pytest.fixture
def app():
    app = Flask(__name__)
    service = MockOntologyService()
    with app.app_context():
        blueprint = create_ontology_api(service)
        app.register_blueprint(blueprint)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def get_jwt(client):
    # Return a dummy JWT token for all tests
    return "mocked.jwt.token"

def auth_header(token):
    return {"Authorization": f"Bearer {token}"}

def test_add_class_success(client):
    token = get_jwt(client)
    res = client.post("/classes", json={"name": "TestClass"}, headers=auth_header(token))
    assert res.status_code == 201
    assert res.json["status"] == "success"

def test_add_class_validation(client):
    token = get_jwt(client)
    res = client.post("/classes", json={}, headers=auth_header(token))
    assert res.status_code == 400
    assert res.json["status"] == "error"

def test_add_class_duplicate(client):
    token = get_jwt(client)
    res = client.post("/classes", json={"name": "duplicate"}, headers=auth_header(token))
    assert res.status_code == 500
    assert res.json["status"] == "error"

def test_get_classes(client):
    token = get_jwt(client)
    client.post("/classes", json={"name": "TestClass"}, headers=auth_header(token))
    res = client.get("/classes")
    assert res.status_code == 200
    assert "TestClass" in res.json["data"]

def test_auth_required(client):
    res = client.post("/classes", json={"name": "TestClass"})
    assert res.status_code == 401

def test_add_property_success(client):
    token = get_jwt(client)
    res = client.post("/properties", json={"name": "TestProp", "type": "object", "domain": "TestClass", "range": "TestClass"}, headers=auth_header(token))
    assert res.status_code == 201
    assert res.json["status"] == "success"

def test_add_property_validation(client):
    token = get_jwt(client)
    res = client.post("/properties", json={"name": "TestProp", "type": "invalid", "domain": "TestClass", "range": "TestClass"}, headers=auth_header(token))
    assert res.status_code == 400
    assert res.json["status"] == "error"
    assert "data" not in res.json

def test_add_constraint_success(client):
    token = get_jwt(client)
    res = client.post("/constraints", json={"class": "TestClass", "property": "TestProp", "type": "minCardinality", "value": 1}, headers=auth_header(token))
    assert res.status_code == 201
    assert res.json["status"] == "success"
    if "data" in res.json:
        assert res.json["data"] is not None

def test_add_constraint_validation(client):
    token = get_jwt(client)
    res = client.post("/constraints", json={"class": "", "property": "", "type": "invalid", "value": 1}, headers=auth_header(token))
    assert res.status_code == 400
    assert res.json["status"] == "error"
    assert "data" not in res.json

def test_add_constraint_missing_class(client):
    token = get_jwt(client)
    res = client.post("/constraints", json={"class": "missing", "property": "TestProp", "type": "minCardinality", "value": 1}, headers=auth_header(token))
    assert res.status_code == 500
    assert res.json["status"] == "error"
    assert "data" not in res.json

@patch('api.routes.send_file')
def test_export_ontology(mock_send_file, client):
    token = get_jwt(client)
    mock_send_file.return_value = Response(b"@prefix : <#> .", status=200)
    res = client.get("/export", headers=auth_header(token))
    assert res.status_code == 200
    assert res.data.startswith(b"@prefix")

@patch('api.routes.request')
def test_import_ontology(mock_request, client):
    token = get_jwt(client)
    class DummyFile:
        stream = b"dummy"
        filename = "ontology.ttl"
    mock_request.files = {"file": DummyFile()}
    mock_request.form = {"format": "turtle"}
    res = client.post("/import", headers=auth_header(token))
    assert res.status_code == 201
    assert res.json["status"] == "success"
