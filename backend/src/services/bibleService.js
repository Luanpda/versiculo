import {
  getCategory,
  getFallbackCard,
  getRandomReference,
} from "../data/cards.js";
import { getImageForCategory } from "./imageService.js";

const FREE_BIBLE_URL = "https://free.bible/bible/pt";

async function getVerse(category) {
  const reference = getRandomReference(category.id);

  try {
    // Busca o capítulo e seleciona somente o versículo desejado.
    const response = await fetch(
      `${FREE_BIBLE_URL}/${reference.book}/${reference.chapter}.json`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!response.ok)
      throw new Error("Não foi possível consultar a API de versículos");

    const chapter = await response.json();
    const verse = chapter.verses.find((item) => item.v === reference.verse);
    if (!verse) throw new Error("Versículo não encontrado");

    return {
      category: category.id,
      categoryTitle: category.title,
      text: verse.t.trim(),
      reference: `${reference.name} ${reference.chapter}:${reference.verse}`,
      source: "Free.Bible",
    };
  } catch (error) {
    // Mantém o site funcionando se a API de versículos falhar.
    console.warn("Usando mensagem local:", error.message);
    return getFallbackCard(category.id);
  }
}

export async function getRandomCard(categoryId) {
  // Faz as duas buscas ao mesmo tempo para deixar a resposta mais rápida.
  const category = getCategory(categoryId);
  const [verse, image] = await Promise.all([
    getVerse(category),
    getImageForCategory(category.id),
  ]);
  return { ...verse, image };
}
