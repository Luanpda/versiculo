import {
  getCategory,
  getFallbackCard,
  getRandomVerse,
} from "../data/cards.js";
import { getImageForCategory } from "./imageService.js";

export async function getRandomCard(categoryId, lang = "pt") {
  const safeLang = ["pt", "es", "en"].includes(lang) ? lang : "pt";
  const category = getCategory(categoryId, safeLang);

  try {
    const [verse, image] = await Promise.all([
      Promise.resolve(getRandomVerse(category.id, safeLang)),
      getImageForCategory(category.id),
    ]);
    return { ...verse, image };
  } catch (error) {
    console.warn("Usando mensagem fallback:", error.message);
    const [fallback, image] = await Promise.all([
      Promise.resolve(getFallbackCard(category.id, safeLang)),
      getImageForCategory(category.id),
    ]);
    return { ...fallback, image };
  }
}
