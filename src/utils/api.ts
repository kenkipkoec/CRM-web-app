const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem("token");

  let baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) baseHeaders["Authorization"] = `Bearer ${token}`;

  let extraHeaders: Record<string, string> = {};
  if (
    options.headers &&
    typeof options.headers === "object" &&
    !Array.isArray(options.headers)
  ) {
    extraHeaders = options.headers as Record<string, string>;
  }

  const headers = { ...baseHeaders, ...extraHeaders };

  let url = `${API_URL}${path.startsWith("/") ? path : "/" + path}`;

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    let msg = await res.text();
    try {
      msg = JSON.parse(msg).error || msg;
    } catch {}
    throw new Error(msg || "API error");
  }
  return res.status === 204 ? null : res.json();
}