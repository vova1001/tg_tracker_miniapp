export async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include", // отправка cookie
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error("API error");
  return res.json();
}
