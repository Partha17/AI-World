# JewelAI — Agentic Jewelry E-Commerce

An agentic-first jewelry marketplace where the primary shopping experience is a conversational AI agent. Instead of browsing grids and filters, users describe what they're looking for and an intelligent agent finds, recommends, and presents jewelry through rich visual cards.

## Architecture

- **Frontend**: Next.js 15 (App Router) on Vercel
- **Agent Service**: Python FastAPI with LangGraph
- **Database**: Supabase (PostgreSQL + pgvector)
- **Auth**: Supabase Auth (magic link + OAuth)
- **LLM**: OpenAI GPT-4o + text-embedding-3-small

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Supabase account (or local Supabase CLI)

### Setup

```bash
# Install Node dependencies
npm install

# Set up the Python agent service
cd apps/agent
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in your keys

# Set up the web app
cd ../web
cp .env.local.example .env.local  # Fill in your keys

# Run both services
cd ../..
npm run dev:web    # Next.js on :3000
npm run dev:agent  # FastAPI on :8000
```

### Supabase Setup

1. Create a new Supabase project
2. Run the migration in `supabase/migrations/`
3. Seed data with `supabase/seed.sql`
4. Copy your project URL and keys to `.env` files

## Project Structure

```
apps/web/       — Next.js frontend (conversational shopping UI)
apps/agent/     — Python FastAPI (AI agent, embeddings, search)
packages/shared — Shared TypeScript types
supabase/       — Database migrations and seed data
```
