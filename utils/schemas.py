from marshmallow import Schema, fields, validate, ValidationError

class ClassSchema(Schema):
    name = fields.Str(required=True, validate=[validate.Length(min=2, max=50), validate.Regexp(r'^[A-Za-z_][A-Za-z0-9_]*$')])
    label = fields.Str(load_default=None)
    comment = fields.Str(load_default=None)
    parent = fields.Str(load_default=None)

class PropertySchema(Schema):
    name = fields.Str(required=True, validate=[validate.Length(min=2, max=50), validate.Regexp(r'^[A-Za-z_][A-Za-z0-9_]*$')])
    type = fields.Str(required=True, validate=validate.OneOf(["object", "data"]))
    domain = fields.Str(required=True)
    range = fields.Str(required=True)
    label = fields.Str(load_default=None)
    comment = fields.Str(load_default=None)

class ConstraintSchema(Schema):
    class_ = fields.Str(required=True, data_key="class")
    property = fields.Str(required=True)
    type = fields.Str(required=True, validate=validate.OneOf(["minCardinality", "maxCardinality", "exactCardinality"]))
    value = fields.Int(required=True, validate=validate.Range(min=0, max=1000))
