from pydantic import BaseModel, Field
from typing import Any


class EmbedRequest(BaseModel):
    product_ids: list[str] | None = Field(
        default=None,
        description="Specific product IDs to embed. If None, embeds all products.",
    )


class ParsedQuery(BaseModel):
    """Structured filters extracted from a natural-language search query."""

    category: str | None = None
    subcategory: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    materials: list[str] | None = None
    gemstones: list[str] | None = None
    occasion: str | None = None
    style: str | None = None
    karat: int | None = None
    gender: str | None = None
    semantic_query: str = ""


class SearchRequest(BaseModel):
    building_id: str
    query: str
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    category: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    seller_id: str | None = None
    sort_by: str = Field(default="relevance", pattern="^(relevance|price_asc|price_desc|newest)$")


class BrowseRequest(BaseModel):
    building_id: str
    category: str | None = None
    subcategory: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    seller_id: str | None = None
    sort_by: str = Field(default="newest", pattern="^(price_asc|price_desc|newest|name)$")
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)


class ProductCard(BaseModel):
    id: str
    name: str
    description: str
    price: float
    currency: str = "INR"
    category: str
    subcategory: str | None = None
    materials: dict[str, Any] = {}
    gemstones: dict[str, Any] | None = None
    thumbnail_url: str
    images: list[str] = []
    style_tags: list[str] = []
    occasion_tags: list[str] = []
    seller_id: str | None = None
    seller_name: str | None = None
    seller_verified: bool | None = None
    shop_name: str | None = None
    floor_number: str | None = None
    score: float | None = None


class SearchResponse(BaseModel):
    products: list[ProductCard]
    total: int
    page: int
    limit: int
    query: str
    parsed: ParsedQuery | None = None


class BuildingInfo(BaseModel):
    id: str
    slug: str
    name: str
    address: str | None = None
    city: str
    state: str | None = None
    branding: dict[str, Any] = {}
    featured_categories: list[str] = []


class BuildingVendor(BaseModel):
    seller_id: str
    brand_name: str
    shop_name: str | None = None
    floor_number: str | None = None
    verified: bool = False
    logo_url: str | None = None


class BuildingDetail(BaseModel):
    building: BuildingInfo
    vendors: list[BuildingVendor]


class CategoryCount(BaseModel):
    category: str
    count: int
