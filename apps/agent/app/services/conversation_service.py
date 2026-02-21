import logging
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from app.db import get_supabase

logger = logging.getLogger(__name__)


async def create_conversation(user_id: str | None = None) -> str:
    """Create a new conversation and return its ID."""
    sb = get_supabase()
    data: dict = {}
    if user_id:
        data["user_id"] = user_id
    rows = await sb.insert("conversations", data)
    return str(rows[0]["id"])


async def save_message(
    conversation_id: str,
    role: str,
    content: str,
    metadata: dict | None = None,
) -> str:
    """Save a message to the database."""
    sb = get_supabase()
    row: dict = {
        "conversation_id": conversation_id,
        "role": role,
        "content": content,
    }
    if metadata:
        row["metadata"] = metadata

    rows = await sb.insert("messages", row)
    return str(rows[0]["id"])


async def get_conversation_messages(
    conversation_id: str, limit: int = 50
) -> list[BaseMessage]:
    """Load conversation history as LangChain messages."""
    sb = get_supabase()
    rows = await sb.select(
        "messages",
        "role,content",
        {
            "conversation_id": f"eq.{conversation_id}",
            "order": "created_at.asc",
            "limit": str(limit),
        },
    )

    messages: list[BaseMessage] = []
    for row in rows:
        if row["role"] == "user":
            messages.append(HumanMessage(content=row["content"]))
        elif row["role"] == "assistant":
            messages.append(AIMessage(content=row["content"]))

    return messages


async def update_conversation_title(conversation_id: str, title: str) -> None:
    """Update the conversation title."""
    sb = get_supabase()
    await sb.update(
        "conversations",
        {"title": title},
        {"id": f"eq.{conversation_id}"},
    )
