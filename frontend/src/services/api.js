const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3001/api" : "/api");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Não foi possível concluir a solicitação.");
  return data;
}

export const api = {
  getCategories: () => request("/cards/categories"),
  getRandomCard: (category) => request(`/cards/random?category=${category}`),
  getPremiumCard: (category) =>
    request(`/cards/premium/random?category=${category}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("palavraToken")}`,
      },
    }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
};
