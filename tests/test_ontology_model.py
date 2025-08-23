import unittest
from models.ontology_model import OntologyModel

class TestOntologyModel(unittest.TestCase):
    def setUp(self):
        self.model = OntologyModel()

    def test_add_class(self):
        self.model.add_class("Person", label="Person", comment="A human being")
        classes = self.model.get_classes()
        self.assertTrue(any(c["name"] == "Person" for c in classes))

    def test_add_property(self):
        self.model.add_class("Person")
        self.model.add_class("Book")
        self.model.add_property("writes", prop_type="object", domain="Person", range_="Book")
        props = self.model.get_properties()
        self.assertTrue(any(p["name"] == "writes" for p in props))

    def test_add_constraint(self):
        self.model.add_class("Person")
        self.model.add_property("writes", prop_type="object", domain="Person")
        self.model.add_constraint("Person", "writes", "minCardinality", 1)
        # No direct way to check, but should not raise

if __name__ == "__main__":
    unittest.main()
