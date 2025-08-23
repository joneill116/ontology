import unittest
from models.ontology_model import OntologyModel

class TestOntologyModelAdvanced(unittest.TestCase):
    def setUp(self):
        self.model = OntologyModel(file_path=':memory:')

    def test_add_annotation_property(self):
        self.model.add_annotation_property("testAnnotation", label="Test", comment="Test comment")
        # Should not raise, and annotation property should exist

    def test_add_advanced_restriction(self):
        self.model.add_class("A")
        self.model.add_property("p", prop_type="object", domain="A")
        self.model.add_class("B")
        self.model.add_advanced_restriction("A", "p", "someValuesFrom", None, "B")
        # Should not raise

if __name__ == "__main__":
    unittest.main()
