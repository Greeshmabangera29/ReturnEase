"""Rule-based fallback recommendations, used when the Gemini API is unavailable
(no key, network error, timeout or invalid response)."""

from models import AiRecommendation

FALLBACK_BY_REASON = {
    "Size doesn't fit": AiRecommendation(
        issue_category="Size/Fit Issue",
        recommended_resolution="Exchange",
        explanation="The product does not fit as expected. Exchanging it for a different size may be suitable.",
    ),
    "Product damaged": AiRecommendation(
        issue_category="Damaged Product",
        recommended_resolution="Refund",
        explanation="The product arrived damaged. A refund may be suitable, or you can exchange it for a new unit.",
    ),
    "Wrong product received": AiRecommendation(
        issue_category="Wrong Item Delivered",
        recommended_resolution="Exchange",
        explanation="A different item was delivered. Exchanging it for the product you ordered may be suitable.",
    ),
    "Product not as expected": AiRecommendation(
        issue_category="Expectation Mismatch",
        recommended_resolution="Refund",
        explanation="The product did not match your expectations. A refund may be suitable.",
    ),
    "Other": AiRecommendation(
        issue_category="General Issue",
        recommended_resolution="Refund",
        explanation="Based on your description, a refund may be suitable. You can choose an exchange instead.",
    ),
}


def get_fallback_recommendation(return_reason: str) -> AiRecommendation:
    return FALLBACK_BY_REASON.get(return_reason, FALLBACK_BY_REASON["Other"])
