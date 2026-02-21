import json
import logging
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from app.db import get_pool

logger = logging.getLogger(__name__)


async def create_conversation(user_id: str | None = None) -> str:
    """Create a new conversation and return its ID."""
    pool = await get_pool()
    row = await pool.fetchrow(
        "INSERT INTO conversations (user_id) VALUES ($1) RETURNING id",
        user_id,
    )
    return str(row["id"])


async def save_message(
    conversation_id: str,
    role: str,
    content: str,
    metadata: dict | None = None,
) -> str:
    """Save a message to the database."""
    pool = await get_pool()
    metadata_json = json.dumps(metadata) if metadata else None
    row = await pool.fetchrow(
        """
        INSERT INTO messages (conversation_id, role, content, metadata)
        VALUES ($1, $2, $3, $4::jsonb)
        RETURNING id
        """,
        conversation_id,
        role,
        content,
        metadata_json,
    )
    return str(row["id"])


async def get_conversation_messages(
    conversation_id: str, limit: int = 50
) -> list[BaseMessage]:
    """Load conversation history as LangChain messages."""
    pool = await get_pool()
    rows = await pool.fetch(
        """
        SELECT role, content
        FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
        LIMIT $2
        """,
        conversation_id,
        limit,
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
    pool = await get_pool()
    await pool.execute(
        "UPDATE conversations SET title = $1 WHERE id = $2",
        title,
        conversation_id,
    )
