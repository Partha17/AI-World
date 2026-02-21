import json
import logging
from app.db import get_supabase
from app.services.embedding_service import generate_embedding
from app.models.schemas import ProductSearchResult

logger = logging.getLogger(__name__)


def _parse_json_field(val):
    if isinstance(val, str):
        return json.loads(val)
    return val


def _row_to_search_result(row: dict, similarity: float | None = None) -> ProductSearchResult:
    return ProductSearchResult(
        id=str(row["id"]),
        name=row["name"],
        description=row["description"],
        price=float(row["price"]),
        currency=row.get("currency", "INR"),
        category=row["category"],
        subcategory=row.get("subcategory"),
        materials=_parse_json_field(row.get("materials")) or {},
        gemstones=_parse_json_field(row.get("gemstones")),
        thumbnail_url=row["thumbnail_url"],
        images=row.get("images") or [],
        style_tags=row.get("style_tags") or [],
        occasion_tags=row.get("occasion_tags") or [],
        similarity=similarity,
    )


async def semantic_search(
    query: str,
    match_count: int = 10,
    match_threshold: float = 0.3,
) -> list[ProductSearchResult]:
    """Search products using vector similarity via the match_products RPC."""
    embedding = await generate_embedding(query)
    embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

    sb = get_supabase()
    data = await sb.rpc(
        "match_products",
        {
            "query_embedding": embedding_str,
            "match_threshold": match_threshold,
            "match_count": match_count,
        },
    )

    return [
        _row_to_search_result(row, similarity=float(row.get("similarity", 0)))
        for row in data
    ]


async def filter_products(
    category: str | None = None,
    subcategory: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    materials: list[str] | None = None,
    occasion: str | None = None,
    style: str | None = None,
    limit: int = 20,
) -> list[ProductSearchResult]:
    """Filter products using structured criteria via PostgREST."""
    sb = get_supabase()
    params: dict[str, str] = {
        "is_active": "eq.true",
        "order": "created_at.desc",
        "limit": str(limit),
    }

    if category:
        params["category"] = f"eq.{category}"
    if subcategory:
        params["subcategory"] = f"eq.{subcategory}"
    if min_price is not None:
        params["price"] = f"gte.{min_price}"
    if max_price is not None:
        price_filter = params.get("price", "")
        if price_filter:
            params.pop("price")
            params["and"] = f"(price.gte.{min_price},price.lte.{max_price})"
        else:
            params["price"] = f"lte.{max_price}"
    if occasion:
        params["occasion_tags"] = f"cs.{{{occasion}}}"
    if style:
        params["style_tags"] = f"cs.{{{style}}}"

    columns = (
        "id,name,description,price,currency,category,subcategory,"
        "materials,gemstones,thumbnail_url,images,style_tags,occasion_tags"
    )

    rows = await sb.select("products", columns, params)

    if materials:
        filtered = []
        for row in rows:
            mat_str = json.dumps(row.get("materials", {})).lower()
            if all(m.lower() in mat_str for m in materials):
                filtered.append(row)
        rows = filtered

    return [_row_to_search_result(row) for row in rows]


async def get_product_by_id(product_id: str) -> dict | None:
    """Get full product details by ID with seller info."""
    sb = get_supabase()
    rows = await sb.select(
        "products",
        "*,sellers(brand_name,verified,rating)",
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
    if row.get("weight_grams"):
        row["weight_grams"] = float(row["weight_grams"])

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
