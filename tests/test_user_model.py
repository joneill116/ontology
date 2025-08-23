import unittest
import os
from models.user_model import UserPersistence

class TestUserPersistence(unittest.TestCase):
    def setUp(self):
        self.db_path = "test_users.db"
        # Remove any existing test db
        if os.path.exists(self.db_path):
            os.remove(self.db_path)
        self.user_db = UserPersistence(self.db_path)

    def tearDown(self):
        if os.path.exists(self.db_path):
            os.remove(self.db_path)

    def test_add_and_get_user(self):
        self.user_db.add_user("alice", b"hashedpw")
        self.assertTrue(self.user_db.user_exists("alice"))
        self.assertEqual(self.user_db.get_user_password("alice"), b"hashedpw")

    def test_update_user(self):
        self.user_db.add_user("bob", b"pw1")
        self.user_db.update_user("bob", b"pw2")
        self.assertEqual(self.user_db.get_user_password("bob"), b"pw2")

    def test_delete_user(self):
        self.user_db.add_user("carol", b"pw")
        self.user_db.delete_user("carol")
        self.assertFalse(self.user_db.user_exists("carol"))

    def test_user_not_found(self):
        self.assertIsNone(self.user_db.get_user_password("notfound"))

if __name__ == "__main__":
    unittest.main()
