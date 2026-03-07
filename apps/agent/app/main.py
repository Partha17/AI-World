import time
import logging
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import get_settings
from app.db import close_pool
from pydantic import BaseModel
from app.models.schemas import (
    EmbedRequest,
    SearchRequest,
    BrowseRequest,
    SearchResponse,
)
from app.services.query_parser import parse_query
from app.services.embedding_service import embed_products
from app.services.product_service import (
    hybrid_search,
    browse_products,
    get_product_by_id,
    find_similar,
)
from app.services.building_service import (
    get_building_by_slug,
    get_building_by_id,
    get_building_categories,
)
from app.services.analytics_service import record_search, record_click, get_trending

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("JewelAI Search Service starting up")
    yield
    await close_pool()
    logger.info("JewelAI Search Service shut down")


app = FastAPI(
    title="JewelAI Search Service",
    version="2.0.0",
    lifespan=lifespan,
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging(request: Request, call_next):
    start = time.time()
    response: Response = await call_next(request)
    duration_ms = (time.time() - start) * 1000
    logger.info(
        "request",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "duration_ms": round(duration_ms, 1),
        },
    )
    return response


# Simple in-memory rate limiter (per-IP, sliding window)
_rate_store: dict[str, list[float]] = {}
RATE_LIMIT = 60  # requests per window
RATE_WINDOW = 60  # seconds


@app.middleware("http")
async def rate_limit(request: Request, call_next):
    if request.url.path == "/health":
        return await call_next(request)

    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    timestamps = _rate_store.get(client_ip, [])
    timestamps = [t for t in timestamps if now - t < RATE_WINDOW]

    if len(timestamps) >= RATE_LIMIT:
        return Response(
            content='{"error": "Rate limit exceeded"}',
            status_code=429,
            media_type="application/json",
        )

    timestamps.append(now)
    _rate_store[client_ip] = timestamps
    return await call_next(request)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "jewel-ai-search"}


# ── Search ──────────────────────────────────────────────────


@app.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """
    AI-powered hybrid search: parses natural language into structured filters,
    then runs vector + full-text + fuzzy search scoped to the building.
    """
    parsed = await parse_query(request.query)

    products = await hybrid_search(
        building_id=request.building_id,
        parsed=parsed,
        limit=request.limit,
        category_override=request.category,
        min_price_override=request.min_price,
        max_price_override=request.max_price,
        seller_id=request.seller_id,
    )

    return SearchResponse(
        products=products,
        total=len(products),
        page=request.page,
        limit=request.limit,
        query=request.query,
        parsed=parsed,
    )


@app.post("/browse")
async def browse(request: BrowseRequest):
    """Browse products in a building with structured filters (no AI parsing)."""
    products, total = await browse_products(
        building_id=request.building_id,
        category=request.category,
        subcategory=request.subcategory,
        min_price=request.min_price,
        max_price=request.max_price,
        seller_id=request.seller_id,
        sort_by=request.sort_by,
        page=request.page,
        limit=request.limit,
    )

    return {
        "products": products,
        "total": total,
        "page": request.page,
        "limit": request.limit,
    }


# ── Products ────────────────────────────────────────────────


@app.get("/products/{product_id}")
async def get_product(
    product_id: str,
    building_id: str = Query(default=None, description="Building ID for vendor location context"),
):
    """Get product details by ID with seller and optional building-vendor info."""
    product = await get_product_by_id(product_id, building_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.get("/products/{product_id}/similar")
async def get_similar(
    product_id: str,
    count: int = Query(default=6, ge=1, le=20),
):
    """Find similar products using vector similarity."""
    results = await find_similar(product_id, count)
    return {"products": results}


# ── Buildings ───────────────────────────────────────────────


@app.get("/buildings/{slug}")
async def get_building(slug: str):
    """Get building info and vendor list by slug."""
    detail = await get_building_by_slug(slug)
    if not detail:
        raise HTTPException(status_code=404, detail="Building not found")
    return detail


@app.get("/buildings/{slug}/categories")
async def get_categories(slug: str):
    """Get available categories with product counts for a building."""
    detail = await get_building_by_slug(slug)
    if not detail:
        raise HTTPException(status_code=404, detail="Building not found")
    categories = await get_building_categories(detail.building.id)
    return {"categories": categories}


@app.get("/buildings/{slug}/featured")
async def get_featured(slug: str, limit: int = Query(default=12, ge=1, le=50)):
    """Get featured/latest products for a building's kiosk home page."""
    detail = await get_building_by_slug(slug)
    if not detail:
        raise HTTPException(status_code=404, detail="Building not found")

    products, total = await browse_products(
        building_id=detail.building.id,
        sort_by="newest",
        limit=limit,
    )
    return {"products": products, "total": total}


# ── Analytics ────────────────────────────────────────────────


class SearchEventRequest(BaseModel):
    building_id: str
    query: str
    result_count: int = 0


class ClickEventRequest(BaseModel):
    building_id: str
    query: str = ""
    product_id: str


@app.post("/analytics/search")
async def log_search(request: SearchEventRequest):
    """Record a search event for trending/analytics."""
    await record_search(request.building_id, request.query, request.result_count)
    return {"status": "ok"}


@app.post("/analytics/click")
async def log_click(request: ClickEventRequest):
    """Record a product click event."""
    await record_click(request.building_id, request.query, request.product_id)
    return {"status": "ok"}


@app.get("/buildings/{slug}/trending")
async def get_trending_products(slug: str, limit: int = Query(default=12, ge=1, le=50)):
    """Get trending products for a building based on recent click analytics."""
    detail = await get_building_by_slug(slug)
    if not detail:
        raise HTTPException(status_code=404, detail="Building not found")
    products = await get_trending(detail.building.id, limit)
    return {"products": products}


# ── Admin ───────────────────────────────────────────────────


@app.post("/admin/embed")
async def embed(request: EmbedRequest):
    """Generate embeddings for products."""
    try:
        count = await embed_products(request.product_ids)
        return {"status": "ok", "embedded_count": count}
    except Exception as e:
        logger.exception("Error embedding products")
        raise HTTPException(status_code=500, detail=str(e))
