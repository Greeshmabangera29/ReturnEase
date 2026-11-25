"""Hardcoded demo orders (not real customer data).

Images are from Unsplash (free to use under the Unsplash License).
"""

from models import Order

SAMPLE_ORDERS = [
    Order(
        order_id="ORD1001",
        product_name="Nike Running Shoes",
        price=2499,
        purchase_date="2026-11-12",
        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop",
    ),
    Order(
        order_id="ORD1002",
        product_name="Casual Blue Shirt",
        price=999,
        purchase_date="2026-11-15",
        image_url="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80&auto=format&fit=crop",
    ),
    Order(
        order_id="ORD1003",
        product_name="Leather Handbag",
        price=1899,
        purchase_date="2026-11-18",
        image_url="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&auto=format&fit=crop",
    ),
]


def find_order(order_id: str) -> Order | None:
    return next((order for order in SAMPLE_ORDERS if order.order_id == order_id), None)
