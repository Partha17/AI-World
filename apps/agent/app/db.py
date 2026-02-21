import httpx
from app.config import get_settings


class SupabaseREST:
    """Lightweight async Supabase REST client using httpx."""

    def __init__(self, url: str, key: str):
        self.base_url = url.rstrip("/")
        self.rest_url = f"{self.base_url}/rest/v1"
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }
        self._client: httpx.AsyncClient | None = None

    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.rest_url,
                headers=self.headers,
                timeout=30.0,
            )
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def select(
        self, table: str, columns: str = "*", params: dict | None = None
    ) -> list[dict]:
        """SELECT query via PostgREST."""
        url = f"/{table}?select={columns}"
        if params:
            for key, val in params.items():
                url += f"&{key}={val}"
        resp = await self.client.get(url)
        resp.raise_for_status()
        return resp.json()

    async def insert(self, table: str, data: dict | list[dict]) -> list[dict]:
        """INSERT via PostgREST."""
        resp = await self.client.post(f"/{table}", json=data)
        resp.raise_for_status()
        return resp.json()

    async def update(self, table: str, data: dict, params: dict) -> list[dict]:
        """UPDATE via PostgREST."""
        url = f"/{table}"
        query_parts = [f"{k}={v}" for k, v in params.items()]
        if query_parts:
            url += "?" + "&".join(query_parts)
        resp = await self.client.patch(url, json=data)
        resp.raise_for_status()
        return resp.json()

    async def upsert(self, table: str, data: dict | list[dict], on_conflict: str | None = None) -> list[dict]:
        """UPSERT via PostgREST."""
        headers = {**self.headers, "Prefer": "resolution=merge-duplicates,return=representation"}
        if on_conflict:
            headers["Prefer"] = f"resolution=merge-duplicates,return=representation"
        url = f"/{table}"
        if on_conflict:
            url += f"?on_conflict={on_conflict}"
        resp = await self.client.post(url, json=data, headers=headers)
        resp.raise_for_status()
        return resp.json()

    async def rpc(self, function_name: str, params: dict | None = None) -> list[dict]:
        """Call a Postgres function via PostgREST RPC."""
        rpc_client = httpx.AsyncClient(
            base_url=self.base_url,
            headers=self.headers,
            timeout=30.0,
        )
        try:
            resp = await rpc_client.post(f"/rest/v1/rpc/{function_name}", json=params or {})
            resp.raise_for_status()
            return resp.json()
        finally:
            await rpc_client.aclose()


_sb: SupabaseREST | None = None


def get_supabase() -> SupabaseREST:
    global _sb
    if _sb is None:
        settings = get_settings()
        _sb = SupabaseREST(settings.supabase_url, settings.supabase_service_role_key)
    return _sb


async def close_pool():
    global _sb
    if _sb:
        await _sb.close()
        _sb = None
