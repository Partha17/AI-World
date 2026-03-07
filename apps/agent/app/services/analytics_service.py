import logging
from app.db import get_supabase
from app.models.schemas import ProductCard

logger = logging.getLogger(__name__)


async def record_search(building_id: str, query: str, result_count: int = 0) -> None:
    """Record a search event for analytics."""
    sb = get_supabase()
    try:
        await sb.insert("search_events", {
            "building_id": building_id,
            "query": query,
            "result_count": result_count,
        })
    except Exception:
        logger.warning("Failed to record search event", exc_info=True)


async def record_click(building_id: str, query: str, product_id: str) -> None:
    """Record a product click event."""
    sb = get_supabase()
    try:
        await sb.insert("search_events", {
            "building_id": building_id,
            "query": query,
            "clicked_product_id": product_id,
        })
    except Exception:
        logger.warning("Failed to record click event", exc_info=True)


async def get_trending(building_id: str, limit: int = 12) -> list[ProductCard]:
    """Get trending products based on recent click analytics."""
    sb = get_supabase()
    rows = await sb.rpc("trending_products", {
        "p_building_id": building_id,
        "p_limit": limit,
    })

    return [
        ProductCard(
            id=str(r["id"]),
            name=r["name"],
            description=r.get("description", ""),
            price=float(r["price"]),
            currency=r.get("currency", "INR"),
            category=r["category"],
            subcategory=r.get("subcategory"),
            materials=r.get("materials") or {},
            gemstones=r.get("gemstones"),
            thumbnail_url=r.get("thumbnail_url", ""),
            images=r.get("images") or [],
            style_tags=r.get("style_tags") or [],
            occasion_tags=r.get("occasion_tags") or [],
            seller_id=str(r["seller_id"]) if r.get("seller_id") else None,
            seller_name=r.get("seller_name"),
            seller_verified=r.get("seller_verified"),
            shop_name=r.get("shop_name"),
            floor_number=r.get("floor_number"),
        )
        for r in rows
    ]
