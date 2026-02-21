from pydantic import BaseModel, Field
from typing import Any


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    user_id: str | None = None


class ProductCard(BaseModel):
    id: str
    name: str
    price: float
    currency: str = "INR"
    thumbnail_url: str
    category: str
    materials: dict[str, Any] = {}


class ChatStreamEvent(BaseModel):
    type: str  # text, products, suggestions, done, error
    data: Any


class EmbedRequest(BaseModel):
    product_ids: list[str] | None = Field(
        default=None,
        description="Specific product IDs to embed. If None, embeds all products.",
    )


class ProductSearchResult(BaseModel):
    id: str
    name: str
    description: str
    price: float
    currency: str
    category: str
    subcategory: str | None
    materials: dict[str, Any]
    gemstones: dict[str, Any] | None
    thumbnail_url: str
    images: list[str]
    style_tags: list[str]
    occasion_tags: list[str]
    similarity: float | None = None
