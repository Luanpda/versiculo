import { Router } from "express";
import { categories } from "../data/cards.js";
import { getRandomCard } from "../services/bibleService.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Entrega ao frontend a lista de botões de categorias.
router.get("/categories", (_request, response) => response.json(categories));

// Entrega um cartão para a demonstração pública sem login.
router.get("/random", async (request, response) => {
  try {
    const rawCategory = typeof request.query.category === "string" ? request.query.category.trim().slice(0, 30) : "bomdia";
    const card = await getRandomCard(rawCategory || "bomdia");
    return response.json(card);
  } catch (error) {
    console.error("Erro ao gerar cartão público:", error.message);
    return response.status(500).json({ message: "Erro ao gerar versículo." });
  }
});

// A área do usuário usa esta rota protegida por JWT.
router.get("/premium/random", requireAuth, async (request, response) => {
  try {
    const rawCategory = typeof request.query.category === "string" ? request.query.category.trim().slice(0, 30) : "bomdia";
    const card = await getRandomCard(rawCategory || "bomdia");
    return response.json(card);
  } catch (error) {
    console.error("Erro ao gerar cartão premium:", error.message);
    return response.status(500).json({ message: "Erro ao gerar versículo." });
  }
});

export default router;
