from marshmallow import ValidationError
from utils.schemas import ClassSchema, PropertySchema, ConstraintSchema

def validate_class_data(data):
    try:
        ClassSchema().load(data)
        return ""
    except ValidationError as err:
        return "; ".join([f"{k}: {', '.join(map(str, v))}" for k, v in err.messages.items()])

def validate_property_data(data):
    try:
        PropertySchema().load(data)
        return ""
    except ValidationError as err:
        return "; ".join([f"{k}: {', '.join(map(str, v))}" for k, v in err.messages.items()])

def validate_constraint_data(data):
    try:
        ConstraintSchema().load(data)
        return ""
    except ValidationError as err:
        return "; ".join([f"{k}: {', '.join(map(str, v))}" for k, v in err.messages.items()])
