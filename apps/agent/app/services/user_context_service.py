import json
import logging
from app.db import get_pool
from app.services.embedding_service import generate_embedding

logger = logging.getLogger(__name__)


async def get_user_profile(user_id: str) -> dict | None:
    """Get user profile with preferences."""
    pool = await get_pool()
    row = await pool.fetchrow(
        """
        SELECT id, display_name, budget_range, style_preferences,
               favorite_materials, ring_size, preferred_occasions,
               onboarding_completed
        FROM user_profiles
        WHERE id = $1
        """,
        user_id,
    )
    if not row:
        return None

    result = dict(row)
    result["id"] = str(result["id"])
    if isinstance(result.get("budget_range"), str):
        result["budget_range"] = json.loads(result["budget_range"])
    return result


async def get_user_context(user_id: str) -> dict:
    """Get combined user context: profile + recent context summaries."""
    profile = await get_user_profile(user_id)

    pool = await get_pool()
    context_rows = await pool.fetch(
        """
        SELECT context_summary, context_type, updated_at
        FROM user_context_vectors
        WHERE user_id = $1
        ORDER BY updated_at DESC
        LIMIT 5
        """,
        user_id,
    )

    contexts = [
        {
            "summary": row["context_summary"],
            "type": row["context_type"],
            "updated_at": row["updated_at"].isoformat(),
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
    pool = await get_pool()
    embedding = await generate_embedding(preference_summary)
    embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

    await pool.execute(
        """
        INSERT INTO user_context_vectors (user_id, context_embedding, context_summary, context_type)
        VALUES ($1, $2::vector, $3, $4)
        """,
        user_id,
        embedding_str,
        preference_summary,
        context_type,
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
    pool = await get_pool()

    updates = []
    params = []
    idx = 2  # $1 is user_id

    if style_preferences is not None:
        updates.append(f"style_preferences = ${idx}")
        params.append(style_preferences)
        idx += 1

    if favorite_materials is not None:
        updates.append(f"favorite_materials = ${idx}")
        params.append(favorite_materials)
        idx += 1

    if preferred_occasions is not None:
        updates.append(f"preferred_occasions = ${idx}")
        params.append(preferred_occasions)
        idx += 1

    if budget_min is not None and budget_max is not None:
        budget = json.dumps({"min": budget_min, "max": budget_max})
        updates.append(f"budget_range = ${idx}::jsonb")
        params.append(budget)
        idx += 1

    if not updates:
        return

    query = f"UPDATE user_profiles SET {', '.join(updates)} WHERE id = $1"
    await pool.execute(query, user_id, *params)
