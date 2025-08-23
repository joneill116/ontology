import sqlite3
from typing import Optional

DB_PATH = "users.db"

class UserPersistence:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    username TEXT PRIMARY KEY,
                    password BLOB NOT NULL
                )
            """)
            conn.commit()

    def add_user(self, username: str, password: bytes):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()

    def update_user(self, username: str, password: bytes):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("UPDATE users SET password = ? WHERE username = ?", (password, username))
            conn.commit()

    def delete_user(self, username: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM users WHERE username = ?", (username,))
            conn.commit()

    def get_user_password(self, username: str) -> Optional[bytes]:
        with sqlite3.connect(self.db_path) as conn:
            cur = conn.execute("SELECT password FROM users WHERE username = ?", (username,))
            row = cur.fetchone()
            return row[0] if row else None

    def user_exists(self, username: str) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            cur = conn.execute("SELECT 1 FROM users WHERE username = ?", (username,))
            return cur.fetchone() is not None
