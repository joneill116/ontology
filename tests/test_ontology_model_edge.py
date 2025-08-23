import unittest
from models.ontology_model import OntologyModel

class TestOntologyModelEdgeCases(unittest.TestCase):
    def setUp(self):
        self.model = OntologyModel(file_path=':memory:')

    def test_empty_class_name(self):
        with self.assertRaises(Exception):
            self.model.add_class("")

    def test_duplicate_class(self):
        self.model.add_class("Person")
        self.model.add_class("Person")  # Should not raise, but should not duplicate
        classes = [c["name"] for c in self.model.get_classes()]
        self.assertEqual(classes.count("Person"), 1)

    def test_invalid_property_type(self):
        with self.assertRaises(Exception):
            self.model.add_property("foo", prop_type="invalid")

    def test_constraint_on_nonexistent_class(self):
        with self.assertRaises(Exception):
            self.model.add_constraint("NoClass", "NoProp", "minCardinality", 1)

if __name__ == "__main__":
    unittest.main()
