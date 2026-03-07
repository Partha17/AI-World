import json
import logging
from app.db import get_supabase
from app.services.embedding_service import generate_embedding
from app.models.schemas import ProductCard, ParsedQuery

logger = logging.getLogger(__name__)


def _parse_json_field(val):
    if isinstance(val, str):
        return json.loads(val)
    return val


def _row_to_card(row: dict) -> ProductCard:
    return ProductCard(
        id=str(row["id"]),
        name=row["name"],
        description=row.get("description", ""),
        price=float(row["price"]),
        currency=row.get("currency", "INR"),
        category=row["category"],
        subcategory=row.get("subcategory"),
        materials=_parse_json_field(row.get("materials")) or {},
        gemstones=_parse_json_field(row.get("gemstones")),
        thumbnail_url=row.get("thumbnail_url", ""),
        images=row.get("images") or [],
        style_tags=row.get("style_tags") or [],
        occasion_tags=row.get("occasion_tags") or [],
        seller_id=str(row["seller_id"]) if row.get("seller_id") else None,
        seller_name=row.get("seller_name"),
        seller_verified=row.get("seller_verified"),
        shop_name=row.get("shop_name"),
        floor_number=row.get("floor_number"),
        score=float(row["score"]) if row.get("score") is not None else None,
    )


async def hybrid_search(
    building_id: str,
    parsed: ParsedQuery,
    limit: int = 20,
    category_override: str | None = None,
    min_price_override: float | None = None,
    max_price_override: float | None = None,
    seller_id: str | None = None,
) -> list[ProductCard]:
    """Run hybrid search (vector + full-text + fuzzy) scoped to a building."""
    embedding = await generate_embedding(parsed.semantic_query or "jewelry")
    embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

    sb = get_supabase()
    params = {
        "p_building_id": building_id,
        "p_query_text": parsed.semantic_query or "",
        "p_query_embedding": embedding_str,
        "p_match_count": limit,
    }

    cat = category_override or parsed.category
    if cat:
        params["p_category"] = cat
    if parsed.subcategory:
        params["p_subcategory"] = parsed.subcategory

    min_p = min_price_override if min_price_override is not None else parsed.min_price
    max_p = max_price_override if max_price_override is not None else parsed.max_price
    if min_p is not None:
        params["p_min_price"] = min_p
    if max_p is not None:
        params["p_max_price"] = max_p

    if parsed.occasion:
        params["p_occasion"] = parsed.occasion
    if parsed.style:
        params["p_style"] = parsed.style
    if seller_id:
        params["p_seller_id"] = seller_id

    rows = await sb.rpc("hybrid_search", params)
    return [_row_to_card(r) for r in rows]


async def browse_products(
    building_id: str,
    category: str | None = None,
    subcategory: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    seller_id: str | None = None,
    sort_by: str = "newest",
    page: int = 1,
    limit: int = 20,
) -> tuple[list[ProductCard], int]:
    """Browse products in a building with filters (no search query)."""
    sort_map = {
        "price_asc": ("price", "asc"),
        "price_desc": ("price", "desc"),
        "newest": ("created_at", "desc"),
        "name": ("name", "asc"),
    }
    col, order = sort_map.get(sort_by, ("created_at", "desc"))

    sb = get_supabase()
    params: dict = {
        "p_building_id": building_id,
        "p_sort_by": col,
        "p_sort_order": order,
        "p_limit": limit,
        "p_offset": (page - 1) * limit,
    }
    if category:
        params["p_category"] = category
    if subcategory:
        params["p_subcategory"] = subcategory
    if min_price is not None:
        params["p_min_price"] = min_price
    if max_price is not None:
        params["p_max_price"] = max_price
    if seller_id:
        params["p_seller_id"] = seller_id

    rows = await sb.rpc("building_browse", params)
    total = int(rows[0]["total_count"]) if rows else 0
    return [_row_to_card(r) for r in rows], total


async def get_product_by_id(product_id: str, building_id: str | None = None) -> dict | None:
    """Get full product details by ID with seller and building-vendor info."""
    sb = get_supabase()
    rows = await sb.select(
        "products",
        "*,sellers(brand_name,verified,rating,logo_url)",
        {"id": f"eq.{product_id}", "is_active": "eq.true"},
    )

    if not rows:
        return None

    row = rows[0]
    seller = row.pop("sellers", {}) or {}

    for key in ("materials", "gemstones"):
        if isinstance(row.get(key), str):
            row[key] = json.loads(row[key])

    row["id"] = str(row["id"])
    row["seller_id"] = str(row["seller_id"])
    row["price"] = float(row["price"])
    row["seller_name"] = seller.get("brand_name")
    row["seller_verified"] = seller.get("verified")
    row["seller_rating"] = seller.get("rating")
    row["seller_logo_url"] = seller.get("logo_url")
    if row.get("weight_grams"):
        row["weight_grams"] = float(row["weight_grams"])

    if building_id:
        bv_rows = await sb.select(
            "building_vendors",
            "shop_name,floor_number",
            {
                "building_id": f"eq.{building_id}",
                "seller_id": f"eq.{row['seller_id']}",
                "is_active": "eq.true",
            },
        )
        if bv_rows:
            row["shop_name"] = bv_rows[0].get("shop_name")
            row["floor_number"] = bv_rows[0].get("floor_number")

    return row


async def find_similar(product_id: str, count: int = 5) -> list[dict]:
    """Find similar products using vector similarity via RPC."""
    sb = get_supabase()
    data = await sb.rpc(
        "find_similar_products",
        {"target_product_id": product_id, "match_count": count},
    )

    return [
        {
            "id": str(row["id"]),
            "name": row["name"],
            "description": row["description"],
            "price": float(row["price"]),
            "currency": row["currency"],
            "category": row["category"],
            "thumbnail_url": row["thumbnail_url"],
            "similarity": float(row["similarity"]),
        }
        for row in data
    ]
