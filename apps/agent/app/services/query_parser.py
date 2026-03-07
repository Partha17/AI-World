import json
import logging
import asyncio
from google import genai
from app.config import get_settings
from app.models.schemas import ParsedQuery

logger = logging.getLogger(__name__)

_client: genai.Client | None = None

SYSTEM_PROMPT = """You are a jewelry search query parser. Extract structured filters from the user's natural-language jewelry search query.

Return a JSON object with ONLY the fields you are confident about:
{
  "category": string or null — one of: "Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Anklets", "Nose Pins", "Head Jewelry", "Bridal Sets", "Accessories"
  "subcategory": string or null — e.g. "Engagement", "Jhumka", "Tennis", "Pendant", "Studs", etc.
  "min_price": number or null — in INR
  "max_price": number or null — in INR. Convert shorthand: "30k" = 30000, "1 lakh" = 100000, "2L" = 200000
  "materials": array of strings or null — e.g. ["Gold", "Platinum", "Silver"]
  "gemstones": array of strings or null — e.g. ["Diamond", "Ruby", "Emerald"]
  "occasion": string or null — e.g. "wedding", "daily-wear", "engagement"
  "style": string or null — e.g. "traditional", "modern", "minimalist"
  "karat": number or null — e.g. 14, 18, 22, 24
  "gender": string or null — "men", "women", or null
  "semantic_query": string — rephrase the query for semantic embedding search, keep it descriptive
}

Rules:
- If the query is vague (e.g. "show me something nice"), just set semantic_query and leave filters null.
- Do NOT guess values. Only extract what is clearly stated or strongly implied.
- Always set semantic_query to a useful rephrased version of the input.
- Return valid JSON only, no markdown."""


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        settings = get_settings()
        _client = genai.Client(api_key=settings.google_api_key)
    return _client


async def parse_query(raw_query: str) -> ParsedQuery:
    """Single Gemini call to extract structured filters from a natural-language query."""
    settings = get_settings()
    client = _get_client()

    try:
        result = await asyncio.to_thread(
            client.models.generate_content,
            model=settings.llm_model,
            contents=[
                {"role": "user", "parts": [{"text": f"{SYSTEM_PROMPT}\n\nQuery: {raw_query}"}]}
            ],
            config={
                "response_mime_type": "application/json",
                "temperature": 0.1,
            },
        )
        parsed = json.loads(result.text)
        if not parsed.get("semantic_query"):
            parsed["semantic_query"] = raw_query
        return ParsedQuery(**{k: v for k, v in parsed.items() if v is not None})
    except Exception:
        logger.exception("Failed to parse query with AI, using raw query as fallback")
        return ParsedQuery(semantic_query=raw_query)
