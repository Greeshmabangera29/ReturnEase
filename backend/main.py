"""ReturnEase FastAPI backend: routes only. Logic lives in the helper modules."""

from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Load backend/.env (GEMINI_API_KEY, GEMINI_MODEL) before anything reads them.
load_dotenv()

from ai_service import get_ai_recommendation  # noqa: E402
from database import get_return_request, init_db, save_return_request  # noqa: E402
from models import (  # noqa: E402
    AnalyzeReturnRequest,
    AnalyzeReturnResponse,
    CreateReturnRequest,
    Order,
    ReturnRequestRecord,
)
from recommendations import get_fallback_recommendation  # noqa: E402
from sample_data import SAMPLE_ORDERS, find_order  # noqa: E402


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # make sure the SQLite table exists before serving requests
    yield


app = FastAPI(title="ReturnEase API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/orders", response_model=list[Order])
def list_orders():
    return SAMPLE_ORDERS


@app.post("/api/analyze-return", response_model=AnalyzeReturnResponse)
def analyze_return(payload: AnalyzeReturnRequest):
    order = find_order(payload.order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    # Try Gemini first; if it fails for any reason, use the rule-based fallback
    # so the customer can always finish their request.
    recommendation = get_ai_recommendation(
        product_name=order.product_name,
        return_reason=payload.return_reason,
        customer_description=payload.customer_description.strip(),
    )
    if recommendation is not None:
        return AnalyzeReturnResponse(**recommendation.model_dump(), is_fallback=False)

    fallback = get_fallback_recommendation(payload.return_reason)
    return AnalyzeReturnResponse(**fallback.model_dump(), is_fallback=True)


@app.post("/api/return-requests", response_model=ReturnRequestRecord, status_code=201)
def create_return_request(payload: CreateReturnRequest):
    order = find_order(payload.order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    # product_name comes from our own data, not from the client.
    return save_return_request(
        product_name=order.product_name,
        order_id=order.order_id,
        return_reason=payload.return_reason,
        customer_description=payload.customer_description.strip(),
        ai_recommendation=payload.ai_recommendation.model_dump(),
        selected_resolution=payload.selected_resolution,
    )


@app.get("/api/return-requests/{request_id}", response_model=ReturnRequestRecord)
def read_return_request(request_id: str):
    record = get_return_request(request_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Return request not found")
    return record
