import { curatedImages } from "../data/curatedImages.js";

// Lista de palavras-chave temáticas variadas por categoria para consultas em APIs externas
const imageSearchThemes = {
  bomdia: [
    "peaceful sunrise landscape",
    "golden dawn nature",
    "morning light mountains",
    "sunbeam forest morning",
    "early morning mist horizon",
  ],
  boanoite: [
    "starry night sky mountains",
    "milky way night landscape",
    "calm night moon stars",
    "peaceful twilight sky",
    "serene night nature",
  ],
  fe: [
    "church cross sunlight",
    "rays of light clouds sky",
    "open bible golden light",
    "mountain sanctuary peaceful",
    "spiritual path sunlight",
  ],
  amor: [
    "family sunset love",
    "holding hands warm light",
    "couple embrace sunset",
    "warm golden hour nature",
    "heart tenderness sunset",
  ],
  paz: [
    "calm lake mountains reflection",
    "serene misty forest stream",
    "peaceful nature landscape",
    "tranquil ocean horizon",
    "gentle meadow mountains",
  ],
  familia: [
    "happy family sunset beach",
    "family walking outdoors",
    "parents and children smiling",
    "family hugging warm light",
    "family together nature picnic",
    "family holding hands sunset",
  ],
  gratidao: [
    "golden wheat field sunlight",
    "grateful open arms sunrise",
    "autumn forest warm light",
    "blooming flowers sun rays",
    "harvest sunset landscape",
  ],
  forca: [
    "majestic mountain peak sunrise",
    "lone strong tree storm",
    "powerful ocean waves rock",
    "climber mountain crest",
    "towering granite mountain",
  ],
};

const PEXELS_URL = "https://api.pexels.com/v1/search";
const UNSPLASH_URL = "https://api.unsplash.com/search/photos";
const PIXABAY_URL = "https://pixabay.com/api/";
const OPENVERSE_URL = "https://api.openverse.org/v1/images/";

// Histórico de fotos recentes por categoria para NUNCA repetir a mesma foto
const recentImagesByCategory = new Map();
let lastServedGlobalId = null;
const MAX_RECENT_HISTORY = 25;

/**
 * Embaralha um array (Fisher-Yates) para garantir aleatoriedade uniforme.
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Seleciona uma imagem garantindo que ela NÃO tenha sido usada recentemente.
 */
function pickUnusedImage(categoryId, images) {
  if (!images || images.length === 0) return null;

  let usedIds = recentImagesByCategory.get(categoryId) || [];

  // Filtra imagens não usadas nesta categoria e diferente da última exibida
  let availableImages = images.filter(
    (img) => !usedIds.includes(String(img.id)) && String(img.id) !== lastServedGlobalId
  );

  // Se todas as fotos do catálogo/API já foram exibidas, reinicia o histórico
  // mantendo apenas as 2 últimas para evitar repetição imediata
  if (availableImages.length === 0) {
    const keepCount = Math.min(2, usedIds.length);
    usedIds = usedIds.slice(-keepCount);
    recentImagesByCategory.set(categoryId, usedIds);
    availableImages = images.filter(
      (img) => !usedIds.includes(String(img.id)) && String(img.id) !== lastServedGlobalId
    );
  }

  // Se ainda assim estiver vazio (caso o pool tenha 1 ou 2 fotos), usa o pool todo exceto a última
  if (availableImages.length === 0) {
    availableImages = images.filter((img) => String(img.id) !== lastServedGlobalId);
  }
  if (availableImages.length === 0) {
    availableImages = images;
  }

  // Sorteia aleatoriamente entre as fotos disponíveis
  const selected = availableImages[Math.floor(Math.random() * availableImages.length)];
  if (!selected) return images[0];

  // Registra no histórico da categoria
  usedIds.push(String(selected.id));
  if (usedIds.length > MAX_RECENT_HISTORY) {
    usedIds.shift();
  }
  recentImagesByCategory.set(categoryId, usedIds);
  lastServedGlobalId = String(selected.id);

  return selected;
}

/**
 * Retorna fotos do banco curado em alta definição (Unsplash / Pexels) com CORS e qualidade garantida.
 */
function getCuratedImage(categoryId) {
  const pool = curatedImages[categoryId] || curatedImages.bomdia;
  const shuffled = shuffleArray(pool);
  return pickUnusedImage(categoryId, shuffled);
}

/**
 * Consulta a API do Unsplash (se chave configurada no .env)
 */
async function getUnsplashApiImage(categoryId, query) {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY;
  if (!apiKey) return null;

  const url = new URL(UNSPLASH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "30");
  url.searchParams.set("page", String(Math.floor(Math.random() * 3) + 1));

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${apiKey}` },
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.results?.length) return null;

  const normalized = data.results.map((item) => ({
    id: `uns-live-${item.id}`,
    url: item.urls.regular,
    author: item.user.name,
    authorUrl: item.user.links.html,
    pageUrl: item.links.html,
    license: "Unsplash License (Livre)",
    licenseUrl: "https://unsplash.com/license",
    provider: "Unsplash",
  }));

  return pickUnusedImage(categoryId, normalized);
}

/**
 * Consulta a API do Pexels (se chave configurada no .env)
 */
async function getPexelsImage(categoryId, query) {
  if (!process.env.PEXELS_API_KEY) return null;

  const url = new URL(PEXELS_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "30");
  url.searchParams.set("page", String(Math.floor(Math.random() * 5) + 1));

  const response = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) return null;

  const { photos } = await response.json();
  if (!photos?.length) return null;

  const normalized = photos.map((image) => ({
    id: `pex-${image.id}`,
    url: image.src.large2x || image.src.large,
    author: image.photographer,
    authorUrl: image.photographer_url,
    pageUrl: image.url,
    license: "Pexels License (Livre)",
    licenseUrl: "https://www.pexels.com/license/",
    provider: "Pexels",
  }));

  return pickUnusedImage(categoryId, normalized);
}

/**
 * Consulta a API do Pixabay (se chave configurada no .env)
 */
async function getPixabayImage(categoryId, query) {
  if (!process.env.PIXABAY_API_KEY) return null;

  const url = new URL(PIXABAY_URL);
  url.searchParams.set("key", process.env.PIXABAY_API_KEY);
  url.searchParams.set("q", query);
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("orientation", "horizontal");
  url.searchParams.set("per_page", "30");
  url.searchParams.set("page", String(Math.floor(Math.random() * 3) + 1));

  const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.hits?.length) return null;

  const normalized = data.hits.map((item) => ({
    id: `pix-${item.id}`,
    url: item.largeImageURL || item.webformatURL,
    author: item.user,
    authorUrl: `https://pixabay.com/users/${item.user}-${item.user_id}/`,
    pageUrl: item.pageURL,
    license: "Pixabay License (Livre)",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    provider: "Pixabay",
  }));

  return pickUnusedImage(categoryId, normalized);
}

/**
 * Consulta alternativa ao Openverse com suporte a várias fontes e licenças abertas
 */
async function getOpenverseFallback(categoryId, query) {
  const url = new URL(OPENVERSE_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("license_type", "commercial,modification");
  url.searchParams.set("page_size", "25");
  url.searchParams.set("page", String(Math.floor(Math.random() * 3) + 1));

  const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!response.ok) return null;

  const { results } = await response.json();
  const validImages = (results || []).filter((img) => img.url && img.creator && !img.mature);
  if (!validImages.length) return null;

  const normalized = validImages.map((image) => ({
    id: `opv-${image.id}`,
    url: image.url,
    author: image.creator,
    authorUrl: image.creator_url || image.foreign_landing_url,
    pageUrl: image.foreign_landing_url,
    license: image.license ? `CC ${image.license.toUpperCase()}` : "Creative Commons",
    licenseUrl: image.license_url || "https://creativecommons.org/",
    provider: "Openverse",
  }));

  return pickUnusedImage(categoryId, normalized);
}

/**
 * Função principal para obter a melhor imagem para cada categoria sem repetições.
 */
export async function getImageForCategory(categoryId) {
  const themes = imageSearchThemes[categoryId] || imageSearchThemes.bomdia;
  const randomQuery = themes[Math.floor(Math.random() * themes.length)];

  // 1. Tenta APIs ativas com chave configurada no .env
  try {
    if (process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY) {
      const unsplashImg = await getUnsplashApiImage(categoryId, randomQuery);
      if (unsplashImg) return unsplashImg;
    }

    if (process.env.PEXELS_API_KEY) {
      const pexelsImg = await getPexelsImage(categoryId, randomQuery);
      if (pexelsImg) return pexelsImg;
    }

    if (process.env.PIXABAY_API_KEY) {
      const pixabayImg = await getPixabayImage(categoryId, randomQuery);
      if (pixabayImg) return pixabayImg;
    }
  } catch (error) {
    console.warn("Falha temporária na API externa:", error.message);
  }

  // 2. Banco Curado de Alta Resolução (Unsplash / Pexels com CORS 100% testado e sem repetição)
  // Esse é o método mais rápido, confiável e com a melhor qualidade visual garantida.
  const curated = getCuratedImage(categoryId);
  if (curated) return curated;

  // 3. Fallback Openverse caso o banco curado falhe
  try {
    const openverseImg = await getOpenverseFallback(categoryId, randomQuery);
    if (openverseImg) return openverseImg;
  } catch (error) {
    console.warn("Falha no Openverse:", error.message);
  }

  return null;
}
