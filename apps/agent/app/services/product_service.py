import json
import logging
from app.db import get_pool
from app.services.embedding_service import generate_embedding
from app.models.schemas import ProductSearchResult

logger = logging.getLogger(__name__)


async def semantic_search(
    query: str,
    match_count: int = 10,
    match_threshold: float = 0.3,
) -> list[ProductSearchResult]:
    """Search products using vector similarity."""
    embedding = await generate_embedding(query)
    embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

    pool = await get_pool()
    rows = await pool.fetch(
        """
        SELECT * FROM match_products($1::vector, $2, $3)
        """,
        embedding_str,
        match_threshold,
        match_count,
    )

    results = []
    for row in rows:
        materials = row["materials"]
        if isinstance(materials, str):
            materials = json.loads(materials)
        gemstones = row["gemstones"]
        if isinstance(gemstones, str):
            gemstones = json.loads(gemstones)

        results.append(
            ProductSearchResult(
                id=str(row["id"]),
                name=row["name"],
                description=row["description"],
                price=float(row["price"]),
                currency=row["currency"],
                category=row["category"],
                subcategory=row["subcategory"],
                materials=materials or {},
                gemstones=gemstones,
                thumbnail_url=row["thumbnail_url"],
                images=row["images"] or [],
                style_tags=row["style_tags"] or [],
                occasion_tags=row["occasion_tags"] or [],
                similarity=float(row["similarity"]),
            )
        )

    return results


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
    """Filter products using structured criteria."""
    pool = await get_pool()

    conditions = ["is_active = true"]
    params: list = []
    idx = 1

    if category:
        conditions.append(f"category = ${idx}")
        params.append(category)
        idx += 1

    if subcategory:
        conditions.append(f"subcategory = ${idx}")
        params.append(subcategory)
        idx += 1

    if min_price is not None:
        conditions.append(f"price >= ${idx}")
        params.append(min_price)
        idx += 1

    if max_price is not None:
        conditions.append(f"price <= ${idx}")
        params.append(max_price)
        idx += 1

    if materials:
        for mat in materials:
            conditions.append(f"materials::text ILIKE ${idx}")
            params.append(f"%{mat}%")
            idx += 1

    if occasion:
        conditions.append(f"${idx} = ANY(occasion_tags)")
        params.append(occasion)
        idx += 1

    if style:
        conditions.append(f"${idx} = ANY(style_tags)")
        params.append(style)
        idx += 1

    where_clause = " AND ".join(conditions)

    rows = await pool.fetch(
        f"""
        SELECT id, name, description, price, currency, category, subcategory,
               materials, gemstones, thumbnail_url, images, style_tags, occasion_tags
        FROM products
        WHERE {where_clause}
        ORDER BY created_at DESC
        LIMIT ${idx}
        """,
        *params,
        limit,
    )

    results = []
    for row in rows:
        materials_data = row["materials"]
        if isinstance(materials_data, str):
            materials_data = json.loads(materials_data)
        gemstones_data = row["gemstones"]
        if isinstance(gemstones_data, str):
            gemstones_data = json.loads(gemstones_data)

        results.append(
            ProductSearchResult(
                id=str(row["id"]),
                name=row["name"],
                description=row["description"],
                price=float(row["price"]),
                currency=row["currency"],
                category=row["category"],
                subcategory=row["subcategory"],
                materials=materials_data or {},
                gemstones=gemstones_data,
                thumbnail_url=row["thumbnail_url"],
                images=row["images"] or [],
                style_tags=row["style_tags"] or [],
                occasion_tags=row["occasion_tags"] or [],
            )
        )

    return results


async def get_product_by_id(product_id: str) -> dict | None:
    """Get full product details by ID."""
    pool = await get_pool()
    row = await pool.fetchrow(
        """
        SELECT p.*, s.brand_name as seller_name, s.verified as seller_verified,
               s.rating as seller_rating
        FROM products p
        JOIN sellers s ON s.id = p.seller_id
        WHERE p.id = $1 AND p.is_active = true
        """,
        product_id,
    )

    if not row:
        return None

    result = dict(row)
    for key in ("materials", "gemstones"):
        if isinstance(result.get(key), str):
            result[key] = json.loads(result[key])

    result["id"] = str(result["id"])
    result["seller_id"] = str(result["seller_id"])
    result["price"] = float(result["price"])
    if result.get("weight_grams"):
        result["weight_grams"] = float(result["weight_grams"])

    return result


async def find_similar(product_id: str, count: int = 5) -> list[dict]:
    """Find similar products using vector similarity."""
    pool = await get_pool()
    rows = await pool.fetch(
        "SELECT * FROM find_similar_products($1, $2)",
        product_id,
        count,
    )

    results = []
    for row in rows:
        results.append(
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
        )

    return results
