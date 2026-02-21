import json
import logging
from app.db import get_supabase
from app.services.embedding_service import generate_embedding

logger = logging.getLogger(__name__)


async def get_user_profile(user_id: str) -> dict | None:
    """Get user profile with preferences."""
    sb = get_supabase()
    rows = await sb.select(
        "user_profiles",
        "id,display_name,budget_range,style_preferences,favorite_materials,"
        "ring_size,preferred_occasions,onboarding_completed",
        {"id": f"eq.{user_id}"},
    )

    if not rows:
        return None

    result = rows[0]
    result["id"] = str(result["id"])
    if isinstance(result.get("budget_range"), str):
        result["budget_range"] = json.loads(result["budget_range"])
    return result


async def get_user_context(user_id: str) -> dict:
    """Get combined user context: profile + recent context summaries."""
    profile = await get_user_profile(user_id)

    sb = get_supabase()
    context_rows = await sb.select(
        "user_context_vectors",
        "context_summary,context_type,updated_at",
        {
            "user_id": f"eq.{user_id}",
            "order": "updated_at.desc",
            "limit": "5",
        },
    )

    contexts = [
        {
            "summary": row["context_summary"],
            "type": row["context_type"],
            "updated_at": str(row["updated_at"]),
        }
        for row in context_rows
    ]

    return {
        "profile": profile,
        "recent_contexts": contexts,
    }


async def update_user_preference(
    user_id: str, preference_summary: str, context_type: str = "preference"
) -> None:
    """Store a new user preference as a context vector."""
    sb = get_supabase()
    embedding = await generate_embedding(preference_summary)
    embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

    await sb.insert(
        "user_context_vectors",
        {
            "user_id": user_id,
            "context_embedding": embedding_str,
            "context_summary": preference_summary,
            "context_type": context_type,
        },
    )
    logger.info(f"Updated context for user {user_id}: {preference_summary[:80]}")


async def update_profile_preferences(
    user_id: str,
    style_preferences: list[str] | None = None,
    favorite_materials: list[str] | None = None,
    preferred_occasions: list[str] | None = None,
    budget_min: float | None = None,
    budget_max: float | None = None,
) -> None:
    """Update user profile structured preferences."""
    sb = get_supabase()
    updates: dict = {}

    if style_preferences is not None:
        updates["style_preferences"] = style_preferences
    if favorite_materials is not None:
        updates["favorite_materials"] = favorite_materials
    if preferred_occasions is not None:
        updates["preferred_occasions"] = preferred_occasions
    if budget_min is not None and budget_max is not None:
        updates["budget_range"] = {"min": budget_min, "max": budget_max}

    if not updates:
        return

    await sb.update(
        "user_profiles",
        updates,
        {"id": f"eq.{user_id}"},
    )
