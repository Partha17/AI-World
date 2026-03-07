export function trackSearch(buildingId: string, query: string, resultCount: number) {
  if (typeof window === "undefined") return;
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "search",
      building_id: buildingId,
      query,
      result_count: resultCount,
    }),
  }).catch(() => {});
}

export function trackClick(buildingId: string, productId: string, query = "") {
  if (typeof window === "undefined") return;
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "click",
      building_id: buildingId,
      query,
      product_id: productId,
    }),
  }).catch(() => {});
}
