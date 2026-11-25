"""ReturnEase FastAPI backend.

Phase 1: only a health-check endpoint to confirm the server runs
and the React frontend can reach it. Real endpoints come in Phase 3.
"""

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load variables from backend/.env (OPENAI_API_KEY, OPENAI_MODEL) into the environment.
load_dotenv()

app = FastAPI(title="ReturnEase API")

# Allow the Vite dev server to call the API directly if needed.
# (In dev the Vite proxy already forwards /api, so this is a safety net.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
