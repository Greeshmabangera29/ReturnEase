"""Pydantic models: validate every request body and shape every response."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

# Only these values are accepted — anything else gets a 422 error automatically.
ReturnReason = Literal[
    "Size doesn't fit",
    "Product damaged",
    "Wrong product received",
    "Product not as expected",
    "Other",
]
Resolution = Literal["Refund", "Exchange"]


class Order(BaseModel):
    order_id: str
    product_name: str
    price: int
    purchase_date: str
    image_url: str


class AnalyzeReturnRequest(BaseModel):
    # Trim spaces first, so "          a" doesn't pass the 10-character minimum.
    model_config = ConfigDict(str_strip_whitespace=True)

    order_id: str
    return_reason: ReturnReason
    customer_description: str = Field(min_length=10, max_length=500)


class AiRecommendation(BaseModel):
    """The exact JSON shape the AI (or the fallback) must return."""

    issue_category: str = Field(max_length=60)
    recommended_resolution: Resolution
    explanation: str = Field(max_length=400)


class AnalyzeReturnResponse(AiRecommendation):
    # True when the rule-based fallback was used instead of the AI.
    is_fallback: bool = False


class CreateReturnRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    order_id: str
    return_reason: ReturnReason
    customer_description: str = Field(min_length=10, max_length=500)
    ai_recommendation: AiRecommendation
    selected_resolution: Resolution  # the customer's final choice


class ReturnRequestRecord(BaseModel):
    request_id: str
    order_id: str
    product_name: str
    return_reason: str
    customer_description: str
    ai_recommendation: AiRecommendation
    selected_resolution: str
    created_at: str
