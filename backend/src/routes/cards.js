import { Router } from "express";
import { getCategories } from "../data/cards.js";
import { getRandomCard } from "../services/bibleService.js";
import { requireAuth } from "../middleware/auth.js";
import { detectLanguageFromRequest } from "./geo.js";

const router = Router();

// Entrega ao frontend a lista de botões de categorias no idioma solicitado.
router.get("/categories", (request, response) => {
  const lang = detectLanguageFromRequest(request);
  return response.json(getCategories(lang));
});

// Entrega um cartão para a demonstração pública sem login no idioma solicitado.
router.get("/random", async (request, response) => {
  try {
    const lang = detectLanguageFromRequest(request);
    const rawCategory =
      typeof request.query.category === "string"
        ? request.query.category.trim().slice(0, 30)
        : "bomdia";
    const card = await getRandomCard(rawCategory || "bomdia", lang);
    return response.json(card);
  } catch (error) {
    console.error("Erro ao gerar cartão público:", error.message);
    return response.status(500).json({ message: "Erro ao gerar versículo." });
  }
});

// A área do usuário usa esta rota protegida por JWT no idioma solicitado.
router.get("/premium/random", requireAuth, async (request, response) => {
  try {
    const lang = detectLanguageFromRequest(request);
    const rawCategory =
      typeof request.query.category === "string"
        ? request.query.category.trim().slice(0, 30)
        : "bomdia";
    const card = await getRandomCard(rawCategory || "bomdia", lang);
    return response.json(card);
  } catch (error) {
    console.error("Erro ao gerar cartão premium:", error.message);
    return response.status(500).json({ message: "Erro ao gerar versículo." });
  }
});

export default router;
