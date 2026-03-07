import logging
from app.db import get_supabase
from app.models.schemas import BuildingInfo, BuildingVendor, BuildingDetail, CategoryCount

logger = logging.getLogger(__name__)


async def get_building_by_slug(slug: str) -> BuildingDetail | None:
    """Fetch a building and its vendors by slug."""
    sb = get_supabase()

    rows = await sb.select(
        "buildings",
        "*",
        {"slug": f"eq.{slug}", "is_active": "eq.true"},
    )
    if not rows:
        return None

    b = rows[0]
    building = BuildingInfo(
        id=str(b["id"]),
        slug=b["slug"],
        name=b["name"],
        address=b.get("address"),
        city=b["city"],
        state=b.get("state"),
        branding=b.get("branding") or {},
        featured_categories=b.get("featured_categories") or [],
    )

    vendor_rows = await sb.select(
        "building_vendors",
        "seller_id,shop_name,floor_number,sellers(brand_name,verified,logo_url)",
        {"building_id": f"eq.{building.id}", "is_active": "eq.true"},
    )

    vendors = []
    for v in vendor_rows:
        seller = v.get("sellers") or {}
        vendors.append(BuildingVendor(
            seller_id=str(v["seller_id"]),
            brand_name=seller.get("brand_name", ""),
            shop_name=v.get("shop_name"),
            floor_number=v.get("floor_number"),
            verified=seller.get("verified", False),
            logo_url=seller.get("logo_url"),
        ))

    return BuildingDetail(building=building, vendors=vendors)


async def get_building_by_id(building_id: str) -> BuildingInfo | None:
    """Fetch building info by ID."""
    sb = get_supabase()
    rows = await sb.select(
        "buildings",
        "*",
        {"id": f"eq.{building_id}", "is_active": "eq.true"},
    )
    if not rows:
        return None

    b = rows[0]
    return BuildingInfo(
        id=str(b["id"]),
        slug=b["slug"],
        name=b["name"],
        address=b.get("address"),
        city=b["city"],
        state=b.get("state"),
        branding=b.get("branding") or {},
        featured_categories=b.get("featured_categories") or [],
    )


async def get_building_categories(building_id: str) -> list[CategoryCount]:
    """Get categories and product counts for a building."""
    sb = get_supabase()
    rows = await sb.rpc("building_categories", {"p_building_id": building_id})
    return [
        CategoryCount(category=r["category"], count=int(r["product_count"]))
        for r in rows
    ]
