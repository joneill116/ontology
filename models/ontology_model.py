
from rdflib import Graph, Namespace, RDF, RDFS, OWL, URIRef, Literal, BNode
from models.persistence import FileOntologyPersistence

EX = Namespace("http://example.org/ontology#")

class OntologyModel:
    def add_annotation_property(self, name, label=None, comment=None):
        uri = self.property_uri(name)
        self.g.add((uri, RDF.type, OWL.AnnotationProperty))
        if label:
            self.g.add((uri, RDFS.label, Literal(label)))
        if comment:
            self.g.add((uri, RDFS.comment, Literal(comment)))
        self._save()

    def add_advanced_restriction(self, class_name, prop_name, restriction_type, value, filler=None):
        class_uri_ = self.class_uri(class_name)
        prop_uri_ = self.property_uri(prop_name)
        restriction = BNode()
        self.g.add((restriction, RDF.type, OWL.Restriction))
        self.g.add((restriction, OWL.onProperty, prop_uri_))
        if restriction_type == "someValuesFrom" and filler:
            self.g.add((restriction, OWL.someValuesFrom, self.class_uri(filler)))
        elif restriction_type == "allValuesFrom" and filler:
            self.g.add((restriction, OWL.allValuesFrom, self.class_uri(filler)))
        elif restriction_type == "hasValue" and filler:
            self.g.add((restriction, OWL.hasValue, self.class_uri(filler)))
        elif restriction_type == "qualifiedCardinality" and filler:
            self.g.add((restriction, OWL.qualifiedCardinality, Literal(value)))
            self.g.add((restriction, OWL.onClass, self.class_uri(filler)))
        self.g.add((class_uri_, RDFS.subClassOf, restriction))
        self._save()
    def __init__(self, file_path=None, persistence=None):
        from config import Config
        self.file_path = file_path or Config.ONTOLOGY_FILE
        self.g = Graph()
        self.g.bind("ex", EX)
        self.g.bind("owl", OWL)
        self.g.bind("rdfs", RDFS)
        self.persistence = persistence or FileOntologyPersistence(self.file_path)
        self._load()

    def _load(self):
        self.persistence.load(self.g)

    def _save(self):
        self.persistence.save(self.g)

    def class_uri(self, name):
        return EX[name]

    def property_uri(self, name):
        return EX[name]

    def add_class(self, name, label=None, comment=None, parent=None):
        uri = self.class_uri(name)
        self.g.add((uri, RDF.type, OWL.Class))
        if label:
            self.g.add((uri, RDFS.label, Literal(label)))
        if comment:
            self.g.add((uri, RDFS.comment, Literal(comment)))
        if parent:
            self.g.add((uri, RDFS.subClassOf, self.class_uri(parent)))
        self._save()

    def add_property(self, name, prop_type="object", domain=None, range_=None, label=None, comment=None):
        uri = self.property_uri(name)
        if prop_type == "object":
            self.g.add((uri, RDF.type, OWL.ObjectProperty))
        else:
            self.g.add((uri, RDF.type, OWL.DatatypeProperty))
        if domain:
            self.g.add((uri, RDFS.domain, self.class_uri(domain)))
        if range_:
            self.g.add((uri, RDFS.range, self.class_uri(range_)))
        if label:
            self.g.add((uri, RDFS.label, Literal(label)))
        if comment:
            self.g.add((uri, RDFS.comment, Literal(comment)))
        self._save()

    def add_constraint(self, class_name, prop_name, constraint_type, value):
        class_uri_ = self.class_uri(class_name)
        prop_uri_ = self.property_uri(prop_name)
        restriction = BNode()
        self.g.add((restriction, RDF.type, OWL.Restriction))
        self.g.add((restriction, OWL.onProperty, prop_uri_))
        if constraint_type == "minCardinality":
            self.g.add((restriction, OWL.minCardinality, Literal(value)))
        elif constraint_type == "maxCardinality":
            self.g.add((restriction, OWL.maxCardinality, Literal(value)))
        elif constraint_type == "exactCardinality":
            self.g.add((restriction, OWL.cardinality, Literal(value)))
        self.g.add((class_uri_, RDFS.subClassOf, restriction))
        self._save()

    def export_ontology(self, fmt="turtle"):
        self._save()
        return self.g.serialize(format=fmt)

    def import_ontology(self, file_stream, fmt="turtle"):
        self.g.parse(file_stream, format=fmt)
        self._save()

    def get_classes(self):
        classes = []
        for s in self.g.subjects(RDF.type, OWL.Class):
            label = self.g.value(s, RDFS.label)
            comment = self.g.value(s, RDFS.comment)
            parent = self.g.value(s, RDFS.subClassOf)
            classes.append({
                "name": str(s).split("#")[-1],
                "label": str(label) if label else None,
                "comment": str(comment) if comment else None,
                "parent": str(parent).split("#")[-1] if parent else None
            })
        return classes

    def get_properties(self):
        properties = []
        for s in self.g.subjects(RDF.type, OWL.ObjectProperty):
            properties.append({"name": str(s).split("#")[-1], "type": "object"})
        for s in self.g.subjects(RDF.type, OWL.DatatypeProperty):
            properties.append({"name": str(s).split("#")[-1], "type": "data"})
        return properties
