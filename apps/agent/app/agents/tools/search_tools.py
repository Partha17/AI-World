from langchain_core.tools import tool
from app.services.product_service import (
    semantic_search,
    filter_products,
    get_product_by_id,
    find_similar,
)


@tool
async def search_products(query: str, max_results: int = 8) -> str:
    """
    Search for jewelry products using natural language. Use this when the user
    describes what they want in conversational terms, like "rose gold ring for
    engagement" or "something traditional for a wedding under 50000".

    Args:
        query: Natural language search query describing desired jewelry
        max_results: Maximum number of results to return (default 8)
    """
    results = await semantic_search(query, match_count=max_results)

    if not results:
        return "No products found matching your description. Try broader terms."

    output_parts = []
    for r in results:
        parts = [
            f"**{r.name}** (ID: {r.id})",
            f"  Price: ₹{r.price:,.0f}",
            f"  Category: {r.category}",
        ]
        if r.materials:
            primary = r.materials.get("primary", "")
            if primary:
                parts.append(f"  Material: {primary}")
        if r.gemstones:
            gem_type = r.gemstones.get("type", "")
            if gem_type:
                parts.append(f"  Gemstone: {gem_type}")
        if r.style_tags:
            parts.append(f"  Style: {', '.join(r.style_tags[:4])}")
        if r.similarity is not None:
            parts.append(f"  Relevance: {r.similarity:.0%}")
        parts.append(f"  Image: {r.thumbnail_url}")
        output_parts.append("\n".join(parts))

    return "\n\n".join(output_parts)


@tool
async def filter_jewelry(
    category: str | None = None,
    subcategory: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    material: str | None = None,
    occasion: str | None = None,
    style: str | None = None,
    limit: int = 10,
) -> str:
    """
    Filter jewelry using structured criteria. Use when the user specifies
    concrete filters like category, price range, material type, or occasion.

    Args:
        category: Jewelry category (Rings, Necklaces, Earrings, Bracelets, Bangles, etc.)
        subcategory: Specific type (Engagement, Wedding Band, Jhumka, Tennis, etc.)
        min_price: Minimum price in INR
        max_price: Maximum price in INR
        material: Material keyword (gold, platinum, silver, diamond, etc.)
        occasion: Occasion tag (wedding, engagement, daily-wear, festive, etc.)
        style: Style tag (traditional, modern, minimalist, kundan, etc.)
        limit: Max results (default 10)
    """
    materials_list = [material] if material else None
    results = await filter_products(
        category=category,
        subcategory=subcategory,
        min_price=min_price,
        max_price=max_price,
        materials=materials_list,
        occasion=occasion,
        style=style,
        limit=limit,
    )

    if not results:
        return "No products match these filters. Try relaxing some criteria."

    output_parts = []
    for r in results:
        parts = [
            f"**{r.name}** (ID: {r.id})",
            f"  Price: ₹{r.price:,.0f} | {r.category}",
        ]
        if r.materials:
            primary = r.materials.get("primary", "")
            if primary:
                parts.append(f"  Material: {primary}")
        parts.append(f"  Image: {r.thumbnail_url}")
        output_parts.append("\n".join(parts))

    return "\n\n".join(output_parts)


@tool
async def get_product_details(product_id: str) -> str:
    """
    Get complete details about a specific jewelry product. Use when the user
    wants to know more about a particular item, asks about specifications,
    certifications, or materials.

    Args:
        product_id: The UUID of the product
    """
    product = await get_product_by_id(product_id)

    if not product:
        return "Product not found."

    parts = [
        f"# {product['name']}",
        f"**Price:** ₹{product['price']:,.0f} {product['currency']}",
        f"**Category:** {product['category']}",
    ]

    if product.get("subcategory"):
        parts.append(f"**Type:** {product['subcategory']}")

    parts.append(f"**Description:** {product['description']}")

    if product.get("materials"):
        mat_lines = [f"  - {k}: {v}" for k, v in product["materials"].items()]
        parts.append("**Materials:**\n" + "\n".join(mat_lines))

    if product.get("gemstones"):
        gem_lines = [f"  - {k}: {v}" for k, v in product["gemstones"].items()]
        parts.append("**Gemstones:**\n" + "\n".join(gem_lines))

    if product.get("weight_grams"):
        parts.append(f"**Weight:** {product['weight_grams']}g")

    if product.get("karat"):
        parts.append(f"**Karat:** {product['karat']}K")

    parts.append(f"**Seller:** {product.get('seller_name', 'N/A')}")
    if product.get("seller_verified"):
        parts.append("**Verified Seller** ✓")
    if product.get("seller_rating"):
        parts.append(f"**Seller Rating:** {product['seller_rating']}/5")

    if product.get("style_tags"):
        parts.append(f"**Style:** {', '.join(product['style_tags'])}")

    if product.get("occasion_tags"):
        parts.append(f"**Perfect for:** {', '.join(product['occasion_tags'])}")

    if product.get("images"):
        parts.append(f"**Images:** {', '.join(product['images'])}")

    return "\n".join(parts)


@tool
async def find_similar_products(product_id: str, count: int = 5) -> str:
    """
    Find products similar to a given product. Use when the user says
    "show me more like this", "similar options", or wants alternatives.

    Args:
        product_id: The UUID of the reference product
        count: Number of similar products to return
    """
    results = await find_similar(product_id, count)

    if not results:
        return "No similar products found."

    output_parts = []
    for r in results:
        parts = [
            f"**{r['name']}** (ID: {r['id']})",
            f"  Price: ₹{r['price']:,.0f} | {r['category']}",
            f"  Similarity: {r['similarity']:.0%}",
            f"  Image: {r['thumbnail_url']}",
        ]
        output_parts.append("\n".join(parts))

    return "\n\n".join(output_parts)
