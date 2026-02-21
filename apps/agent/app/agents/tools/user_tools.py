from langchain_core.tools import tool
from app.services.user_context_service import (
    get_user_context,
    update_user_preference,
    update_profile_preferences,
)


@tool
async def get_user_preferences(user_id: str) -> str:
    """
    Retrieve the user's profile and preference context. Use this at the start
    of a conversation or when you need to personalize recommendations based on
    known preferences, budget, style, and past interactions.

    Args:
        user_id: The user's UUID
    """
    if not user_id:
        return "No user ID provided. Shopping as guest — no preference history available."

    context = await get_user_context(user_id)

    parts = []

    profile = context.get("profile")
    if profile:
        parts.append(f"**Name:** {profile.get('display_name', 'Unknown')}")

        budget = profile.get("budget_range")
        if budget:
            parts.append(
                f"**Budget Range:** ₹{budget.get('min', 0):,.0f} - ₹{budget.get('max', 0):,.0f}"
            )

        styles = profile.get("style_preferences", [])
        if styles:
            parts.append(f"**Style Preferences:** {', '.join(styles)}")

        materials = profile.get("favorite_materials", [])
        if materials:
            parts.append(f"**Favorite Materials:** {', '.join(materials)}")

        occasions = profile.get("preferred_occasions", [])
        if occasions:
            parts.append(f"**Preferred Occasions:** {', '.join(occasions)}")

        if profile.get("ring_size"):
            parts.append(f"**Ring Size:** {profile['ring_size']}")
    else:
        parts.append("No profile found for this user.")

    contexts = context.get("recent_contexts", [])
    if contexts:
        parts.append("\n**Recent Interactions:**")
        for ctx in contexts:
            parts.append(f"  - [{ctx['type']}] {ctx['summary']}")

    return "\n".join(parts) if parts else "No preference data available."


@tool
async def save_user_preference(
    user_id: str, preference_description: str
) -> str:
    """
    Save a new user preference learned from the conversation. Call this when
    the user expresses a clear preference like "I love rose gold",
    "I prefer minimalist designs", "My budget is around 50000".

    Args:
        user_id: The user's UUID
        preference_description: A clear description of the preference learned
    """
    if not user_id:
        return "Cannot save preferences for guest users."

    await update_user_preference(user_id, preference_description)
    return f"Preference saved: {preference_description}"


@tool
async def update_user_profile_preferences(
    user_id: str,
    style_preferences: list[str] | None = None,
    favorite_materials: list[str] | None = None,
    preferred_occasions: list[str] | None = None,
    budget_min: float | None = None,
    budget_max: float | None = None,
) -> str:
    """
    Update the user's structured profile preferences. Use when the user
    explicitly shares structured info like budget range, favorite materials,
    or style preferences that should persist.

    Args:
        user_id: The user's UUID
        style_preferences: List of style preferences (e.g. ["modern", "minimalist"])
        favorite_materials: List of preferred materials (e.g. ["rose gold", "platinum"])
        preferred_occasions: List of occasions (e.g. ["wedding", "daily-wear"])
        budget_min: Minimum budget in INR
        budget_max: Maximum budget in INR
    """
    if not user_id:
        return "Cannot update profile for guest users."

    await update_profile_preferences(
        user_id=user_id,
        style_preferences=style_preferences,
        favorite_materials=favorite_materials,
        preferred_occasions=preferred_occasions,
        budget_min=budget_min,
        budget_max=budget_max,
    )

    return "Profile preferences updated successfully."
