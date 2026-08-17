"""SQLite database layer for prediction history.

Schema mirrors the fields defined in the project config:
id, image_name, image_path, species, confidence, created_at
"""
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Optional

DB_PATH = Path(__file__).resolve().parent / "predictions.db"
IMAGES_DIR = Path(__file__).resolve().parent / "uploads"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_name TEXT NOT NULL,
                image_path TEXT NOT NULL,
                species TEXT NOT NULL,
                confidence REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


def insert_prediction(image_name: str, image_path: str, species: str, confidence: float) -> dict:
    created_at = datetime.now().isoformat()
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO predictions (image_name, image_path, species, confidence, created_at) "
            "VALUES (?, ?, ?, ?, ?)",
            (image_name, image_path, species, confidence, created_at),
        )
        pid = cur.lastrowid
        return {
            "id": pid,
            "image_name": image_name,
            "image_path": image_path,
            "species": species,
            "confidence": confidence,
            "created_at": created_at,
        }


def list_predictions() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT id, image_name, image_path, species, confidence, created_at "
            "FROM predictions ORDER BY id DESC"
        ).fetchall()
        return [dict(r) for r in rows]


def get_prediction(pid: int) -> Optional[dict]:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, image_name, image_path, species, confidence, created_at "
            "FROM predictions WHERE id = ?",
            (pid,),
        ).fetchone()
        return dict(row) if row else None


def delete_prediction(pid: int) -> bool:
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM predictions WHERE id = ?", (pid,))
        return cur.rowcount > 0
