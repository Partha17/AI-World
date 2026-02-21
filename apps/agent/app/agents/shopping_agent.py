import json
import logging
from typing import Annotated, TypedDict, Sequence
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from app.config import get_settings
from app.agents.tools.search_tools import (
    search_products,
    filter_jewelry,
    get_product_details,
    find_similar_products,
)
from app.agents.tools.user_tools import (
    get_user_preferences,
    save_user_preference,
    update_user_profile_preferences,
)

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are JewelAI, an expert jewelry shopping assistant. You help customers discover and find the perfect jewelry pieces through natural conversation.

## Your Expertise
- Deep knowledge of jewelry: metals (gold karats, platinum, silver), gemstones (4 Cs of diamonds, colored gems), techniques (kundan, meenakari, filigree, temple jewelry)
- Indian and Western jewelry traditions, styles, and occasions
- Understanding of jewelry as investment, heirloom, fashion, and personal expression
- Price ranges and value assessment for different materials and craftsmanship levels

## Your Approach
1. **Listen and understand** — Ask clarifying questions to understand the occasion, recipient, style preference, and budget
2. **Personalize** — Use the user's known preferences and past interactions to tailor recommendations
3. **Educate** — Share interesting facts about materials, craftsmanship, and cultural significance when relevant
4. **Present beautifully** — When showing products, highlight what makes each piece special and why it fits their needs
5. **Build trust** — Be transparent about materials, certifications, and seller verification

## Product Presentation
When showing products to users, always structure them as a rich display:
- Include the product name, price, key materials/gemstones, and why it's a good match
- When showing multiple products, briefly note what differentiates each option
- Always be ready to show more details, similar items, or different options

## Conversation Guidelines
- Be warm, knowledgeable, and enthusiastic about jewelry without being pushy
- If the user is vague, ask ONE focused question to narrow down (don't overwhelm with questions)
- Suggest complementary pieces when appropriate (e.g., matching earrings for a necklace)
- If a user mentions a budget, respect it and find the best value within their range
- When a user expresses a preference (likes/dislikes), remember it for future recommendations

## Important
- Always use the search tools to find real products — never make up product details
- If no results match, be honest and suggest alternative search terms or relaxed criteria
- When a user shares preferences, save them using the preference tools
- Present prices in INR (₹) format

You are NOT just a chatbot — you are a knowledgeable jewelry consultant who happens to have access to an entire marketplace of curated pieces."""


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    user_id: str | None
    conversation_id: str | None


ALL_TOOLS = [
    search_products,
    filter_jewelry,
    get_product_details,
    find_similar_products,
    get_user_preferences,
    save_user_preference,
    update_user_profile_preferences,
]


def create_agent():
    """Create and return the LangGraph shopping agent."""
    settings = get_settings()

    llm = ChatGoogleGenerativeAI(
        model=settings.llm_model,
        google_api_key=settings.google_api_key,
        temperature=0.7,
        streaming=True,
    )

    llm_with_tools = llm.bind_tools(ALL_TOOLS)

    def should_continue(state: AgentState) -> str:
        messages = state["messages"]
        last_message = messages[-1]
        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            return "tools"
        return END

    async def call_agent(state: AgentState) -> dict:
        messages = state["messages"]

        has_system = any(isinstance(m, SystemMessage) for m in messages)
        if not has_system:
            messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(messages)

        response = await llm_with_tools.ainvoke(messages)
        return {"messages": [response]}

    tool_node = ToolNode(ALL_TOOLS)

    workflow = StateGraph(AgentState)

    workflow.add_node("agent", call_agent)
    workflow.add_node("tools", tool_node)

    workflow.set_entry_point("agent")
    workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    workflow.add_edge("tools", "agent")

    return workflow.compile()


_agent = None


def get_agent():
    """Get or create the singleton agent instance."""
    global _agent
    if _agent is None:
        _agent = create_agent()
    return _agent


async def run_agent(
    message: str,
    conversation_history: list[BaseMessage] | None = None,
    user_id: str | None = None,
    conversation_id: str | None = None,
):
    """
    Run the shopping agent with a user message.
    Yields (event_type, data) tuples for streaming.
    """
    agent = get_agent()

    messages = list(conversation_history) if conversation_history else []
    messages.append(HumanMessage(content=message))

    state = AgentState(
        messages=messages,
        user_id=user_id,
        conversation_id=conversation_id,
    )

    collected_text = ""
    product_ids = []

    async for event in agent.astream_events(state, version="v2"):
        kind = event["event"]

        if kind == "on_chat_model_stream":
            chunk = event["data"]["chunk"]
            if hasattr(chunk, "content") and chunk.content:
                content = chunk.content
                if isinstance(content, list):
                    content = "".join(
                        part.get("text", "") if isinstance(part, dict) else str(part)
                        for part in content
                    )
                if content:
                    collected_text += content
                    yield ("text", content)

        elif kind == "on_tool_start":
            tool_name = event.get("name", "")
            logger.info(f"Tool called: {tool_name}")

        elif kind == "on_tool_end":
            tool_output = event["data"].get("output", "")
            if "ID:" in str(tool_output):
                import re
                ids = re.findall(
                    r"ID:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})",
                    str(tool_output),
                )
                product_ids.extend(ids)

    if product_ids:
        yield ("products", list(set(product_ids)))

    suggestions = _generate_suggestions(collected_text, message)
    if suggestions:
        yield ("suggestions", suggestions)

    yield ("done", None)


def _generate_suggestions(agent_response: str, user_message: str) -> list[str]:
    """Generate follow-up suggestion chips based on context."""
    suggestions = []

    response_lower = agent_response.lower()
    message_lower = user_message.lower()

    if any(w in response_lower for w in ["ring", "engagement", "solitaire"]):
        suggestions.extend(["Show me in rose gold", "Under ₹1 lakh", "With diamond"])
    elif any(w in response_lower for w in ["necklace", "pendant", "chain"]):
        suggestions.extend(["Matching earrings", "Shorter length", "In gold"])
    elif any(w in response_lower for w in ["earring", "jhumka", "stud"]):
        suggestions.extend(["Matching necklace", "Something lighter", "For daily wear"])
    elif any(w in response_lower for w in ["bracelet", "bangle", "kada"]):
        suggestions.extend(["Show me sets", "In silver", "For gifting"])

    if "wedding" in message_lower or "bridal" in message_lower:
        suggestions.append("Show complete bridal sets")
    if "gift" in message_lower:
        suggestions.append("Gift wrapping options")
    if not suggestions:
        suggestions = [
            "Show me trending pieces",
            "What's good for gifting?",
            "Something under ₹25,000",
        ]

    return suggestions[:4]
