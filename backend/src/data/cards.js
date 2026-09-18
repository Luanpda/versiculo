import { multilangVerses } from "./multilangVerses.js";

// Definições oficiais das 8 categorias com títulos e labels em Português, Espanhol e Inglês.
export const categoryDefinitions = {
  bomdia: {
    id: "bomdia",
    pt: { label: "Bom Dia", title: "BOM DIA" },
    es: { label: "Buenos Días", title: "BUENOS DÍAS" },
    en: { label: "Good Morning", title: "GOOD MORNING" },
  },
  boanoite: {
    id: "boanoite",
    pt: { label: "Boa Noite", title: "BOA NOITE" },
    es: { label: "Buenas Noches", title: "BUENAS NOCHES" },
    en: { label: "Good Night", title: "GOOD NIGHT" },
  },
  fe: {
    id: "fe",
    pt: { label: "Fé", title: "FÉ" },
    es: { label: "Fe", title: "FE" },
    en: { label: "Faith", title: "FAITH" },
  },
  amor: {
    id: "amor",
    pt: { label: "Amor", title: "AMOR" },
    es: { label: "Amor", title: "AMOR" },
    en: { label: "Love", title: "LOVE" },
  },
  paz: {
    id: "paz",
    pt: { label: "Paz", title: "PAZ" },
    es: { label: "Paz", title: "PAZ" },
    en: { label: "Peace", title: "PEACE" },
  },
  familia: {
    id: "familia",
    pt: { label: "Família", title: "FAMÍLIA" },
    es: { label: "Familia", title: "FAMILIA" },
    en: { label: "Family", title: "FAMILY" },
  },
  gratidao: {
    id: "gratidao",
    pt: { label: "Gratidão", title: "GRATIDÃO" },
    es: { label: "Gratitud", title: "GRATITUD" },
    en: { label: "Gratitude", title: "GRATITUDE" },
  },
  forca: {
    id: "forca",
    pt: { label: "Força", title: "FORÇA" },
    es: { label: "Fuerza", title: "FUERZA" },
    en: { label: "Strength", title: "STRENGTH" },
  },
};

// Export padrão em Português para compatibilidade reversa
export const categories = Object.values(categoryDefinitions).map((item) => ({
  id: item.id,
  label: item.pt.label,
  title: item.pt.title,
}));

// Retorna categorias no idioma solicitado
export function getCategories(lang = "pt") {
  const safeLang = ["pt", "es", "en"].includes(lang) ? lang : "pt";
  return Object.values(categoryDefinitions).map((item) => ({
    id: item.id,
    label: item[safeLang].label,
    title: item[safeLang].title,
  }));
}

export function getCategory(id, lang = "pt") {
  const safeLang = ["pt", "es", "en"].includes(lang) ? lang : "pt";
  const def = categoryDefinitions[id] || categoryDefinitions.bomdia;
  return {
    id: def.id,
    label: def[safeLang].label,
    title: def[safeLang].title,
  };
}

export const fallbackMessages = {
  bomdia: {
    pt: [
      "Que este novo dia seja cheio de paz, esperança e gratidão.",
      "A cada amanhecer, renovam-se as misericórdias e as oportunidades de ser feliz.",
      "Que o seu dia seja abençoado com luz, discernimento e passos firmes.",
    ],
    es: [
      "Que este nuevo día esté lleno de paz, esperanza y gratitud.",
      "Cada mañana se renuevan las misericordias y las oportunidades de ser feliz.",
      "Que tu día sea bendecido con luz, discernimiento y pasos firmes.",
    ],
    en: [
      "May this new day be filled with peace, hope, and gratitude.",
      "With every dawn, mercies and opportunities to be joyful are renewed.",
      "May your day be blessed with light, wisdom, and steadfast steps.",
    ],
  },
  boanoite: {
    pt: [
      "Que a noite traga descanso ao coração e paz para o amanhã.",
      "Entregue as preocupações e descanse sob o cuidado de Deus.",
      "Uma noite serena e abençoada para recarregar as energias e a esperança.",
    ],
    es: [
      "Que la noche traiga descanso al corazón y paz para el mañana.",
      "Entrega las preocupaciones y descansa bajo el cuidado de Dios.",
      "Una noche serena y bendecida para recargar energías y esperanza.",
    ],
    en: [
      "May the night bring rest to your heart and peace for tomorrow.",
      "Surrender your worries and rest under God's loving care.",
      "A serene and blessed night to recharge your energy and hope.",
    ],
  },
  fe: {
    pt: [
      "Confie mesmo quando ainda não consegue enxergar todo o caminho.",
      "A fé não torna as coisas mais fáceis, torna as coisas possíveis.",
      "Mantenha o coração firme: quem confia nunca caminha sozinho.",
    ],
    es: [
      "Confía incluso cuando aún no puedas ver todo el camino.",
      "La fe no hace las cosas más fáciles, hace las cosas posibles.",
      "Mantén el corazón firme: quien confía nunca camina solo.",
    ],
    en: [
      "Trust even when you cannot yet see the entire path ahead.",
      "Faith does not make things easier, it makes them possible.",
      "Keep your heart steadfast: those who trust never walk alone.",
    ],
  },
  amor: {
    pt: [
      "Que o amor esteja presente nas pequenas atitudes de todos os dias.",
      "Onde existe amor sincero, floresce a paz e a compreensão.",
      "Amar é cuidar, perdoar e desejar sempre o melhor ao próximo.",
    ],
    es: [
      "Que el amor esté presente en las pequeñas actitudes de cada día.",
      "Donde hay amor sincero, florece la paz y la comprensión.",
      "Amar es cuidar, perdonar y desear siempre lo mejor al prójimo.",
    ],
    en: [
      "May love be present in every small gesture throughout each day.",
      "Where sincere love exists, peace and deep understanding flourish.",
      "To love is to care, forgive, and always wish the best for others.",
    ],
  },
  paz: {
    pt: [
      "Que a paz encontre espaço dentro do seu coração hoje.",
      "A verdadeira paz é aquela que acalma o espírito em meio a qualquer tempestade.",
      "Cultive pensamentos leves e guarde o seu coração com serenidade.",
    ],
    es: [
      "Que la paz encuentre un lugar dentro de tu corazón hoy.",
      "La verdadera paz es la que calma el espíritu en medio de cualquier tormenta.",
      "Cultiva pensamientos ligeros y guarda tu corazón con serenidad.",
    ],
    en: [
      "May peace find a home within your heart today.",
      "True peace is that which calms the spirit amidst any storm.",
      "Nurture gentle thoughts and guard your heart with serenity.",
    ],
  },
  familia: {
    pt: [
      "Que sua família seja sempre um lugar de amor, cuidado e união.",
      "A família é o refúgio seguro onde o amor se multiplica e o coração descansa.",
      "Que a harmonia, o carinho e a bênção de Deus estejam em cada lar.",
    ],
    es: [
      "Que tu familia sea siempre un lugar de amor, cuidado y unión.",
      "La familia es el refugio seguro donde el amor se multiplica y el corazón descansa.",
      "Que la armonía, el cariño y la bendición de Dios estén en cada hogar.",
    ],
    en: [
      "May your family always be a sanctuary of love, care, and unity.",
      "Family is the safe haven where love multiplies and hearts rest.",
      "May harmony, affection, and God's blessings dwell in every home.",
    ],
  },
  gratidao: {
    pt: [
      "Sempre existe algo precioso pelo qual podemos agradecer hoje.",
      "Um coração grato enxerga motivos de alegria em cada detalhe da vida.",
      "A gratidão transforma o que temos no suficiente.",
    ],
    es: [
      "Siempre hay algo valioso por lo que podemos agradecer hoy.",
      "Un corazón agradecido ve motivos de alegría en cada detalle de la vida.",
      "La gratitud transforma lo que tenemos en suficiente.",
    ],
    en: [
      "There is always something precious to be thankful for today.",
      "A grateful heart discovers reasons for joy in every detail of life.",
      "Gratitude turns what we have into enough.",
    ],
  },
  forca: {
    pt: [
      "Você pode atravessar este momento um dia de cada vez.",
      "A sua força é renovada a cada passo de coragem.",
      "Não tema os desafios, você foi capacitado para superar cada um deles.",
    ],
    es: [
      "Puedes atravesar este momento un día a la vez.",
      "Tu fuerza se renueva con cada paso de valentía.",
      "No temas a los desafíos, has sido capacitado para superar cada uno de ellos.",
    ],
    en: [
      "You can get through this moment one day at a time.",
      "Your strength is renewed with every courageous step you take.",
      "Fear not the challenges before you; you have been equipped to overcome them all.",
    ],
  },
};

// Histórico de versículos recentes por categoria para não repetir
const recentVerseHistory = new Map();

export function getRandomVerse(categoryId, lang = "pt") {
  const safeLang = ["pt", "es", "en"].includes(lang) ? lang : "pt";
  const category = getCategory(categoryId, safeLang);
  const verses = multilangVerses[category.id] || multilangVerses.bomdia;
  const history = recentVerseHistory.get(category.id) || [];

  let available = verses.filter(
    (v) => !history.includes(`${v.book}-${v.chapter}-${v.verse}`)
  );

  if (available.length === 0) {
    const last = history.slice(-1);
    recentVerseHistory.set(category.id, last);
    available = verses.filter(
      (v) => !last.includes(`${v.book}-${v.chapter}-${v.verse}`)
    );
  }

  if (available.length === 0) available = verses;

  const selected = available[Math.floor(Math.random() * available.length)];
  const key = `${selected.book}-${selected.chapter}-${selected.verse}`;

  history.push(key);
  if (history.length > 10) history.shift();
  recentVerseHistory.set(category.id, history);

  const localized = selected[safeLang] || selected.pt;

  return {
    category: category.id,
    categoryTitle: category.title,
    text: localized.text.trim(),
    reference: localized.reference,
    lang: safeLang,
    source:
      safeLang === "es"
        ? "Reina-Valera 1960"
        : safeLang === "en"
        ? "King James Version"
        : "Almeida",
  };
}

export function getFallbackCard(categoryId, lang = "pt") {
  const safeLang = ["pt", "es", "en"].includes(lang) ? lang : "pt";
  const category = getCategory(categoryId, safeLang);
  const catMsgs = fallbackMessages[category.id] || fallbackMessages.bomdia;
  const msgs = catMsgs[safeLang] || catMsgs.pt;
  const text = msgs[Math.floor(Math.random() * msgs.length)];
  const refLabels = {
    pt: "Mensagem de",
    es: "Mensaje de",
    en: "Message of",
  };
  const prefix = refLabels[safeLang] || "Mensagem de";
  return {
    category: category.id,
    categoryTitle: category.title,
    text,
    reference: `${prefix} ${category.label.replace(/^\S+\s/, "")}`,
    lang: safeLang,
    source: "local",
  };
}
