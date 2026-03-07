# JewelAI — Architecture Diagrams

## 1. System Overview

High-level view of all components, services, and their interactions.

```mermaid
graph TB
    subgraph Client["Browser (Client)"]
        UI["Next.js App<br/>React 19 · Tailwind 4"]
    end

    subgraph Vercel["Vercel Edge"]
        subgraph NextAPI["Next.js API Routes"]
            AS["/api/search"]
            AB["/api/browse"]
            ABld["/api/buildings/[slug]"]
            AA["/api/analytics"]
        end
        SSR["Server Components<br/>(ISR + SSR)"]
    end

    subgraph Agent["FastAPI Agent Service"]
        QP["Query Parser"]
        PS["Product Service"]
        BS["Building Service"]
        AnS["Analytics Service"]
        ES["Embedding Service"]
        RL["Rate Limiter<br/>Middleware"]
    end

    subgraph External["External Services"]
        Gemini["Google Gemini<br/>gemini-2.5-flash-lite<br/>gemini-embedding-001"]
        Supa["Supabase<br/>PostgreSQL + pgvector"]
    end

    UI -- "fetch /api/*" --> NextAPI
    UI -- "SSR page request" --> SSR
    SSR -- "apiGet / apiPost" --> Agent
    AS -- "POST /search" --> RL
    AB -- "POST /browse" --> RL
    ABld -- "GET /buildings/:slug" --> RL
    AA -- "POST /analytics/*" --> RL
    RL --> QP
    RL --> PS
    RL --> BS
    RL --> AnS
    QP -- "LLM: parse query → JSON" --> Gemini
    ES -- "embed(text) → vector(3072)" --> Gemini
    PS -- "hybrid_search RPC" --> Supa
    PS -- "building_browse RPC" --> Supa
    BS -- "REST: buildings, building_vendors" --> Supa
    AnS -- "REST: search_events" --> Supa

    style Client fill:#f0f9ff,stroke:#3b82f6
    style Vercel fill:#fefce8,stroke:#eab308
    style Agent fill:#f0fdf4,stroke:#22c55e
    style External fill:#fdf2f8,stroke:#ec4899
```

---

## 2. Search Query Flow

End-to-end data flow when a user searches for jewelry.

```mermaid
sequenceDiagram
    actor User
    participant UI as Search Page<br/>(React Client)
    participant Proxy as Next.js API<br/>/api/search
    participant API as FastAPI<br/>POST /search
    participant QP as Query Parser
    participant LLM as Gemini LLM<br/>(flash-lite)
    participant Embed as Gemini Embeddings<br/>(embedding-001)
    participant DB as Supabase<br/>hybrid_search RPC

    User->>UI: Types "gold jhumka under 30k"
    UI->>Proxy: POST /api/search<br/>{ building_id, query, limit }
    Proxy->>API: POST /search (proxied)

    rect rgb(240, 253, 244)
        Note over API,LLM: AI Query Understanding
        API->>QP: parse_query("gold jhumka under 30k")
        QP->>LLM: System: jewelry query parser<br/>User: "gold jhumka under 30k"
        LLM-->>QP: { category: "Earrings",<br/>subcategory: "Jhumka",<br/>max_price: 30000,<br/>semantic_query: "gold jhumka earrings" }
    end

    rect rgb(239, 246, 255)
        Note over API,DB: Hybrid Search (3 signals)
        API->>Embed: embed("gold jhumka earrings")
        Embed-->>API: vector(3072)
        API->>DB: hybrid_search(<br/>building_id, query_text,<br/>query_embedding, max_price: 30000,<br/>category: "Earrings")
        Note over DB: 1. Vector: cosine similarity (×0.5)<br/>2. Full-text: ts_rank on tsvector (×0.3)<br/>3. Fuzzy: pg_trgm similarity (×0.2)<br/>→ Reciprocal Rank Fusion
        DB-->>API: ProductCard[] with scores
    end

    API-->>Proxy: { products, total, parsed }
    Proxy-->>UI: SearchResponse JSON
    UI-->>User: Render product grid + AI filter tags

    Note over UI: Fire-and-forget analytics
    UI-)Proxy: POST /api/analytics<br/>{ type: "search", query, result_count }
```

---

## 3. Database Schema (ER Diagram)

All tables, relationships, and key columns.

```mermaid
erDiagram
    buildings {
        uuid id PK
        text slug UK
        text name
        text address
        text city
        text state
        jsonb location
        jsonb branding
        text[] featured_categories
        boolean is_active
        timestamptz created_at
    }

    sellers {
        uuid id PK
        text brand_name
        text description
        text logo_url
        numeric rating
        boolean verified
        jsonb contact_info
        timestamptz created_at
    }

    building_vendors {
        uuid building_id PK,FK
        uuid seller_id PK,FK
        text floor_number
        text shop_name
        boolean is_active
        timestamptz created_at
    }

    products {
        uuid id PK
        uuid seller_id FK
        text name
        text description
        numeric price
        text currency
        text category
        text subcategory
        jsonb materials
        jsonb gemstones
        text thumbnail_url
        text[] images
        text[] style_tags
        text[] occasion_tags
        tsvector search_vector "GENERATED"
        timestamptz created_at
    }

    product_embeddings {
        uuid id PK
        uuid product_id FK
        vector_3072 embedding
        text text_content
        text model_version
        timestamptz created_at
    }

    search_events {
        uuid id PK
        uuid building_id FK
        text query
        int result_count
        uuid clicked_product_id FK
        timestamptz created_at
    }

    building_featured_products {
        uuid id PK
        uuid building_id FK
        uuid product_id FK
        int display_order
        timestamptz created_at
    }

    buildings ||--o{ building_vendors : "has vendors"
    sellers ||--o{ building_vendors : "present in"
    sellers ||--o{ products : "sells"
    products ||--o{ product_embeddings : "embedded as"
    buildings ||--o{ search_events : "tracks"
    products ||--o{ search_events : "clicked"
    buildings ||--o{ building_featured_products : "features"
    products ||--o{ building_featured_products : "featured in"
```

---

## 4. Multi-Tenancy & Routing Model

How buildings, vendors, and products relate to URL structure.

```mermaid
graph TB
    subgraph URLStructure["URL Routing (Next.js App Router)"]
        Root["/ → redirect"]
        BHome["/zaveri-bazaar-mumbai"]
        BSearch["/zaveri-bazaar-mumbai/search?q=..."]
        BCat["/zaveri-bazaar-mumbai/category/Rings"]
        BProd["/zaveri-bazaar-mumbai/product/uuid"]
    end

    subgraph Tenancy["Multi-Tenant Data Model"]
        B1["🏢 Building: Zaveri Bazaar Mumbai<br/>slug: zaveri-bazaar-mumbai<br/>branding: { primary_color, welcome_message }"]
        B2["🏢 Building: Jewel Plaza Jaipur<br/>slug: jewel-plaza-jaipur<br/>branding: { primary_color, welcome_message }"]

        V1["🏪 Vendor A<br/>Shop: Royal Gold<br/>Floor: Ground Floor"]
        V2["🏪 Vendor B<br/>Shop: Diamond Palace<br/>Floor: 1st Floor"]
        V3["🏪 Vendor C<br/>Shop: Gem House<br/>Floor: 2nd Floor"]

        P1["💍 Product 1<br/>by Vendor A"]
        P2["💍 Product 2<br/>by Vendor A"]
        P3["💎 Product 3<br/>by Vendor B"]
        P4["📿 Product 4<br/>by Vendor C"]
    end

    subgraph Scoping["Data Scoping"]
        HSearch["hybrid_search(building_id)<br/>Only returns products from<br/>vendors in THIS building"]
        Browse["building_browse(building_id)<br/>Filtered by building"]
        Cats["building_categories(building_id)<br/>Category counts per building"]
        Trend["trending_products(building_id)<br/>Click analytics per building"]
    end

    Root --> BHome
    BHome --> BSearch
    BHome --> BCat
    BSearch --> BProd

    B1 --> V1
    B1 --> V2
    B2 --> V2
    B2 --> V3

    V1 --> P1
    V1 --> P2
    V2 --> P3
    V3 --> P4

    B1 -. "scoped queries" .-> HSearch
    B1 -. "scoped queries" .-> Browse
    B1 -. "scoped queries" .-> Cats
    B1 -. "scoped queries" .-> Trend

    style URLStructure fill:#f0f9ff,stroke:#3b82f6
    style Tenancy fill:#fefce8,stroke:#eab308
    style Scoping fill:#f0fdf4,stroke:#22c55e
```

---

## 5. CI/CD Pipeline & Deployment

Build, test, and deploy flow.

```mermaid
flowchart LR
    subgraph Trigger["Trigger"]
        Push["Push to main<br/>or feature/**"]
        PR["PR to main"]
    end

    subgraph CI["GitHub Actions CI"]
        direction TB
        subgraph WebJob["Job: Web (Next.js)"]
            W1["Checkout code"]
            W2["Setup Node 20"]
            W3["npm ci<br/>(workspace: @ai-world/web)"]
            W4["npx tsc --noEmit<br/>Type check"]
            W5["npm run build<br/>Production build"]
            W1 --> W2 --> W3 --> W4 --> W5
        end

        subgraph AgentJob["Job: Agent (Python)"]
            A1["Checkout code"]
            A2["Setup Python 3.13"]
            A3["pip install -r<br/>requirements.txt"]
            A4["py_compile<br/>main.py + services"]
            A1 --> A2 --> A3 --> A4
        end
    end

    subgraph Deploy["Deployment Targets"]
        VercelDeploy["Vercel<br/>Next.js Frontend<br/>+ API Routes"]
        AgentDeploy["Docker / Serverless<br/>FastAPI Agent"]
        SupaDeploy["Supabase<br/>Managed Postgres<br/>+ pgvector"]
    end

    Push --> CI
    PR --> CI
    WebJob -.-> VercelDeploy
    AgentJob -.-> AgentDeploy
    SupaDeploy -.- AgentDeploy

    style Trigger fill:#fdf2f8,stroke:#ec4899
    style CI fill:#f0f9ff,stroke:#3b82f6
    style Deploy fill:#f0fdf4,stroke:#22c55e
```
