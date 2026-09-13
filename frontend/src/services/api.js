const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3001/api" : "/api");

function getActiveLang() {
  return localStorage.getItem("palavraLang") || "pt";
}

async function request(path, options = {}) {
  const lang = getActiveLang();
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-user-lang": lang,
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Não foi possível concluir a solicitação.");
  return data;
}

export const api = {
  getCategories: (lang = getActiveLang()) =>
    request(`/cards/categories?lang=${encodeURIComponent(lang)}`),
  getRandomCard: (category, lang = getActiveLang()) =>
    request(
      `/cards/random?category=${encodeURIComponent(category)}&lang=${encodeURIComponent(lang)}`
    ),
  getPremiumCard: (category, lang = getActiveLang()) =>
    request(
      `/cards/premium/random?category=${encodeURIComponent(category)}&lang=${encodeURIComponent(lang)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("palavraToken")}`,
        },
      }
    ),
  detectLanguage: () => request("/geo/detect"),
  updateLanguage: (language) =>
    request("/auth/language", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("palavraToken")}`,
      },
      body: JSON.stringify({ language }),
    }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
};

