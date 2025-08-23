
from models.ontology_model import OntologyModel
from utils.logging import logger

class OntologyService:
    def __init__(self, model=None):
        # Dependency injection: pass a model instance or use default
        self.model = model if model is not None else OntologyModel()

    def add_class(self, name, label=None, comment=None, parent=None):
        logger.info(f"API: Add class '{name}' (label={label}, parent={parent})")
        existing = [c["name"] for c in self.get_classes()]
        if name in existing:
            raise ValueError(f"Class '{name}' already exists.")
        if parent and parent not in existing:
            raise ValueError(f"Parent class '{parent}' does not exist.")
        self.model.add_class(name, label, comment, parent)
        logger.info(f"Ontology: Class '{name}' created.")

    def add_property(self, name, prop_type="object", domain=None, range_=None, label=None, comment=None):
        logger.info(f"API: Add property '{name}' (type={prop_type}, domain={domain}, range={range_})")
        existing = [p["name"] for p in self.get_properties()]
        if name in existing:
            raise ValueError(f"Property '{name}' already exists.")
        class_names = [c["name"] for c in self.get_classes()]
        if domain and domain not in class_names:
            raise ValueError(f"Domain class '{domain}' does not exist.")
        if range_ and range_ not in class_names:
            raise ValueError(f"Range class '{range_}' does not exist.")
        self.model.add_property(name, prop_type, domain, range_, label, comment)

    def add_constraint(self, class_name, prop_name, constraint_type, value):
        self.model.add_constraint(class_name, prop_name, constraint_type, value)

    def add_annotation_property(self, name, label=None, comment=None):
        self.model.add_annotation_property(name, label, comment)

    def add_advanced_restriction(self, class_name, prop_name, restriction_type, value, filler=None):
        self.model.add_advanced_restriction(class_name, prop_name, restriction_type, value, filler)

    def export_ontology(self, fmt="turtle"):
        return self.model.export_ontology(fmt)

    def import_ontology(self, file_stream, fmt="turtle"):
        self.model.import_ontology(file_stream, fmt)

    def get_classes(self):
        return self.model.get_classes()

    def get_properties(self):
        return self.model.get_properties()
