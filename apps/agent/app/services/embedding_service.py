import json
import logging
from openai import AsyncOpenAI
from app.config import get_settings
from app.db import get_pool

logger = logging.getLogger(__name__)

_openai: AsyncOpenAI | None = None


def _get_openai() -> AsyncOpenAI:
    global _openai
    if _openai is None:
        settings = get_settings()
        _openai = AsyncOpenAI(api_key=settings.openai_api_key)
    return _openai


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
    """Generate an embedding vector for the given text."""
    settings = get_settings()
    client = _get_openai()
    response = await client.embeddings.create(
        model=settings.embedding_model,
        input=text,
        dimensions=settings.embedding_dimensions,
    )
    return response.data[0].embedding


async def embed_products(product_ids: list[str] | None = None) -> int:
    """
    Embed products and store in product_embeddings table.
    If product_ids is None, embeds all active products.
    Returns the number of products embedded.
    """
    pool = await get_pool()
    settings = get_settings()

    if product_ids:
        placeholders = ", ".join(f"${i+1}" for i in range(len(product_ids)))
        query = f"""
            SELECT id, name, description, category, subcategory,
                   materials, gemstones, style_tags, occasion_tags,
                   karat, price
            FROM products
            WHERE id = ANY(ARRAY[{placeholders}]::uuid[])
              AND is_active = true
        """
        rows = await pool.fetch(query, *product_ids)
    else:
        rows = await pool.fetch("""
            SELECT id, name, description, category, subcategory,
                   materials, gemstones, style_tags, occasion_tags,
                   karat, price
            FROM products
            WHERE is_active = true
        """)

    if not rows:
        logger.info("No products to embed")
        return 0

    count = 0
    batch_size = 20
    client = _get_openai()

    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        texts = []
        for row in batch:
            product_dict = dict(row)
            if isinstance(product_dict.get("materials"), str):
                product_dict["materials"] = json.loads(product_dict["materials"])
            if isinstance(product_dict.get("gemstones"), str):
                product_dict["gemstones"] = json.loads(product_dict["gemstones"])
            texts.append(build_product_text(product_dict))

        response = await client.embeddings.create(
            model=settings.embedding_model,
            input=texts,
            dimensions=settings.embedding_dimensions,
        )

        for row, embedding_data, text_content in zip(
            batch, response.data, texts
        ):
            embedding = embedding_data.embedding
            embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

            await pool.execute(
                """
                INSERT INTO product_embeddings (product_id, embedding, text_content, model_version)
                VALUES ($1, $2::vector, $3, $4)
                ON CONFLICT (product_id) DO UPDATE
                SET embedding = $2::vector,
                    text_content = $3,
                    model_version = $4,
                    created_at = now()
                """,
                row["id"],
                embedding_str,
                text_content,
                settings.embedding_model,
            )
            count += 1

        logger.info(f"Embedded batch {i // batch_size + 1}: {len(batch)} products")

    logger.info(f"Embedded {count} products total")
    return count
