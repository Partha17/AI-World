import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sse_starlette.sse import EventSourceResponse
from app.config import get_settings
from app.db import close_pool
from app.models.schemas import ChatRequest, EmbedRequest
from app.agents.shopping_agent import run_agent
from app.services.conversation_service import (
    create_conversation,
    save_message,
    get_conversation_messages,
)
from app.services.embedding_service import embed_products
from app.services.product_service import get_product_by_id

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("JewelAI Agent Service starting up")
    yield
    await close_pool()
    logger.info("JewelAI Agent Service shut down")


app = FastAPI(
    title="JewelAI Agent Service",
    version="0.1.0",
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


@app.get("/health")
async def health():
    return {"status": "ok", "service": "jewel-ai-agent"}


@app.post("/agent/chat")
async def chat(request: ChatRequest):
    """
    Stream a conversation with the shopping agent via Server-Sent Events.
    Each event has a type: text, products, suggestions, done, or error.
    """

    async def event_generator():
        try:
            conversation_id = request.conversation_id
            if not conversation_id:
                conversation_id = await create_conversation(request.user_id)
                yield {
                    "event": "conversation",
                    "data": json.dumps({"conversation_id": conversation_id}),
                }

            await save_message(conversation_id, "user", request.message)

            history = await get_conversation_messages(conversation_id)
            # Remove the last message since run_agent adds it
            if history:
                history = history[:-1]

            collected_text = ""

            async for event_type, data in run_agent(
                message=request.message,
                conversation_history=history,
                user_id=request.user_id,
                conversation_id=conversation_id,
            ):
                if event_type == "text":
                    collected_text += data
                    yield {
                        "event": "text",
                        "data": json.dumps({"content": data}),
                    }
                elif event_type == "products":
                    yield {
                        "event": "products",
                        "data": json.dumps({"product_ids": data}),
                    }
                elif event_type == "suggestions":
                    yield {
                        "event": "suggestions",
                        "data": json.dumps({"suggestions": data}),
                    }
                elif event_type == "done":
                    if collected_text:
                        metadata = {}
                        await save_message(
                            conversation_id,
                            "assistant",
                            collected_text,
                            metadata,
                        )
                    yield {
                        "event": "done",
                        "data": json.dumps({"conversation_id": conversation_id}),
                    }

        except Exception as e:
            logger.exception("Error in chat stream")
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}),
            }

    return EventSourceResponse(event_generator())


@app.post("/agent/embed")
async def embed(request: EmbedRequest):
    """Generate embeddings for products."""
    try:
        count = await embed_products(request.product_ids)
        return {"status": "ok", "embedded_count": count}
    except Exception as e:
        logger.exception("Error embedding products")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get product details by ID."""
    product = await get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
