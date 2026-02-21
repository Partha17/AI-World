import json
import logging
import asyncio
from google import genai
from app.config import get_settings
from app.db import get_supabase

logger = logging.getLogger(__name__)

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        settings = get_settings()
        _client = genai.Client(api_key=settings.google_api_key)
    return _client


def build_product_text(product: dict) -> str:
    """Build a rich text representation of a product for embedding."""
    parts = [
        product["name"],
        product["description"],
        f"Category: {product['category']}",
    ]

    if product.get("subcategory"):
        parts.append(f"Type: {product['subcategory']}")

    materials = product.get("materials")
    if materials:
        if isinstance(materials, str):
            materials = json.loads(materials)
        mat_parts = [f"{k}: {v}" for k, v in materials.items()]
        parts.append(f"Materials: {', '.join(mat_parts)}")

    gemstones = product.get("gemstones")
    if gemstones:
        if isinstance(gemstones, str):
            gemstones = json.loads(gemstones)
        gem_parts = [f"{k}: {v}" for k, v in gemstones.items()]
        parts.append(f"Gemstones: {', '.join(gem_parts)}")

    style_tags = product.get("style_tags", [])
    if style_tags:
        parts.append(f"Style: {', '.join(style_tags)}")

    occasion_tags = product.get("occasion_tags", [])
    if occasion_tags:
        parts.append(f"Occasions: {', '.join(occasion_tags)}")

    if product.get("karat"):
        parts.append(f"{product['karat']} karat")

    price = product.get("price")
    if price:
        parts.append(f"Price: ₹{price:,.0f}")

    return " | ".join(parts)


async def generate_embedding(text: str) -> list[float]:
    """Generate an embedding vector using Google Gemini."""
    settings = get_settings()
    client = _get_client()

    result = await asyncio.to_thread(
        client.models.embed_content,
        model=settings.embedding_model,
        contents=text,
    )
    return result.embeddings[0].values


async def embed_products(product_ids: list[str] | None = None) -> int:
    """Embed products and store in product_embeddings table via Supabase REST API."""
    sb = get_supabase()
    settings = get_settings()
    client = _get_client()

    params = {"is_active": "eq.true", "order": "created_at.desc"}
    if product_ids:
        params["id"] = f"in.({','.join(product_ids)})"

    rows = await sb.select(
        "products",
        "id,name,description,category,subcategory,materials,gemstones,style_tags,occasion_tags,karat,price",
        params,
    )

    if not rows:
        logger.info("No products to embed")
        return 0

    count = 0
    batch_size = 20

    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        texts = [build_product_text(row) for row in batch]

        result = await asyncio.to_thread(
            client.models.embed_content,
            model=settings.embedding_model,
            contents=texts,
        )

        for row, emb_obj, text_content in zip(batch, result.embeddings, texts):
            embedding = emb_obj.values
            embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

            await sb.upsert(
                "product_embeddings",
                {
                    "product_id": row["id"],
                    "embedding": embedding_str,
                    "text_content": text_content,
                    "model_version": settings.embedding_model,
                },
                on_conflict="product_id",
            )
            count += 1

        logger.info(f"Embedded batch {i // batch_size + 1}: {len(batch)} products")

    logger.info(f"Embedded {count} products total")
    return count
