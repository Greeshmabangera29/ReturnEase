"""SQLite storage for return requests, using Python's built-in sqlite3 module (no ORM)."""

import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

# The database file lives next to this file: backend/returnease.db (git-ignored).
DB_PATH = Path(__file__).parent / "returnease.db"


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row  # lets us read columns by name
    return connection


def init_db() -> None:
    """Create the table on startup if it doesn't exist yet."""
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS return_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                request_id TEXT NOT NULL UNIQUE,
                product_name TEXT NOT NULL,
                order_id TEXT NOT NULL,
                return_reason TEXT NOT NULL,
                customer_description TEXT NOT NULL,
                ai_recommendation TEXT NOT NULL,  -- JSON string
                selected_resolution TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


def generate_request_id() -> str:
    # e.g. RE-3F9A1C2B — short, readable, and random enough for a demo.
    return f"RE-{uuid.uuid4().hex[:8].upper()}"


def save_return_request(
    product_name: str,
    order_id: str,
    return_reason: str,
    customer_description: str,
    ai_recommendation: dict,
    selected_resolution: str,
) -> dict:
    request_id = generate_request_id()
    created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO return_requests (
                request_id, product_name, order_id, return_reason,
                customer_description, ai_recommendation, selected_resolution, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request_id,
                product_name,
                order_id,
                return_reason,
                customer_description,
                json.dumps(ai_recommendation),
                selected_resolution,
                created_at,
            ),
        )

    return get_return_request(request_id)


def get_return_request(request_id: str) -> dict | None:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM return_requests WHERE request_id = ?", (request_id,)
        ).fetchone()

    if row is None:
        return None

    record = dict(row)
    record["ai_recommendation"] = json.loads(record["ai_recommendation"])
    return record
