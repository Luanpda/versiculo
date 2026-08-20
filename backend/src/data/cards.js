// Categorias exibidas como botões no frontend.
export const categories = [
  { id: "bomdia", label: "🌅 Bom Dia", title: "🌅 BOM DIA" },
  { id: "boanoite", label: "🌙 Boa Noite", title: "🌙 BOA NOITE" },
  { id: "fe", label: "🙏 Fé", title: "🙏 FÉ" },
  { id: "amor", label: "❤️ Amor", title: "❤️ AMOR" },
  { id: "paz", label: "🕊️ Paz", title: "🕊️ PAZ" },
  { id: "familia", label: "👨‍👩‍👧 Família", title: "👨‍👩‍👧 FAMÍLIA" },
  { id: "gratidao", label: "✨ Gratidão", title: "✨ GRATIDÃO" },
  { id: "forca", label: "💪 Força", title: "💪 FORÇA" },
];

// Referências testadas e validadas na API da Bíblia em português.
// Múltiplos versículos por tema garantem grande variedade e zero repetição.
const bibleReferences = {
  bomdia: [
    { book: "psalms", name: "Salmos", chapter: 118, verse: 24 },
    { book: "lamentations", name: "Lamentações", chapter: 3, verse: 22 },
    { book: "psalms", name: "Salmos", chapter: 143, verse: 8 },
    { book: "psalms", name: "Salmos", chapter: 5, verse: 3 },
    { book: "psalms", name: "Salmos", chapter: 90, verse: 14 },
    { book: "psalms", name: "Salmos", chapter: 59, verse: 16 },
    { book: "proverbs", name: "Provérbios", chapter: 4, verse: 18 },
    { book: "psalms", name: "Salmos", chapter: 30, verse: 5 },
  ],
  boanoite: [
    { book: "psalms", name: "Salmos", chapter: 4, verse: 8 },
    { book: "psalms", name: "Salmos", chapter: 121, verse: 4 },
    { book: "psalms", name: "Salmos", chapter: 91, verse: 1 },
    { book: "proverbs", name: "Provérbios", chapter: 3, verse: 24 },
    { book: "psalms", name: "Salmos", chapter: 63, verse: 6 },
    { book: "psalms", name: "Salmos", chapter: 127, verse: 2 },
    { book: "matthew", name: "Mateus", chapter: 11, verse: 28 },
    { book: "psalms", name: "Salmos", chapter: 139, verse: 12 },
  ],
  fe: [
    { book: "hebrews", name: "Hebreus", chapter: 11, verse: 1 },
    { book: "mark", name: "Marcos", chapter: 9, verse: 23 },
    { book: "2-corinthians", name: "2 Coríntios", chapter: 5, verse: 7 },
    { book: "romans", name: "Romanos", chapter: 10, verse: 17 },
    { book: "matthew", name: "Mateus", chapter: 21, verse: 22 },
    { book: "hebrews", name: "Hebreus", chapter: 11, verse: 6 },
    { book: "proverbs", name: "Provérbios", chapter: 3, verse: 5 },
    { book: "luke", name: "Lucas", chapter: 1, verse: 37 },
  ],
  amor: [
    { book: "1-corinthians", name: "1 Coríntios", chapter: 13, verse: 4 },
    { book: "1-john", name: "1 João", chapter: 4, verse: 8 },
    { book: "1-john", name: "1 João", chapter: 4, verse: 19 },
    { book: "1-corinthians", name: "1 Coríntios", chapter: 13, verse: 13 },
    { book: "romans", name: "Romanos", chapter: 8, verse: 38 },
    { book: "colossians", name: "Colossenses", chapter: 3, verse: 14 },
    { book: "1-peter", name: "1 Pedro", chapter: 4, verse: 8 },
    { book: "john", name: "João", chapter: 15, verse: 12 },
  ],
  paz: [
    { book: "john", name: "João", chapter: 14, verse: 27 },
    { book: "philippians", name: "Filipenses", chapter: 4, verse: 7 },
    { book: "isaiah", name: "Isaías", chapter: 26, verse: 3 },
    { book: "romans", name: "Romanos", chapter: 15, verse: 13 },
    { book: "psalms", name: "Salmos", chapter: 29, verse: 11 },
    { book: "matthew", name: "Mateus", chapter: 5, verse: 9 },
    { book: "psalms", name: "Salmos", chapter: 34, verse: 14 },
    { book: "colossians", name: "Colossenses", chapter: 3, verse: 15 },
  ],
  familia: [
    { book: "joshua", name: "Josué", chapter: 24, verse: 15 },
    { book: "colossians", name: "Colossenses", chapter: 3, verse: 14 },
    { book: "psalms", name: "Salmos", chapter: 127, verse: 3 },
    { book: "psalms", name: "Salmos", chapter: 128, verse: 3 },
    { book: "proverbs", name: "Provérbios", chapter: 17, verse: 17 },
    { book: "proverbs", name: "Provérbios", chapter: 22, verse: 6 },
    { book: "genesis", name: "Gênesis", chapter: 28, verse: 14 },
    { book: "ephesians", name: "Efésios", chapter: 6, verse: 4 },
  ],
  gratidao: [
    { book: "1-thessalonians", name: "1 Tessalonicenses", chapter: 5, verse: 18 },
    { book: "psalms", name: "Salmos", chapter: 107, verse: 1 },
    { book: "psalms", name: "Salmos", chapter: 103, verse: 2 },
    { book: "colossians", name: "Colossenses", chapter: 3, verse: 15 },
    { book: "psalms", name: "Salmos", chapter: 100, verse: 4 },
    { book: "psalms", name: "Salmos", chapter: 136, verse: 1 },
    { book: "philippians", name: "Filipenses", chapter: 4, verse: 6 },
    { book: "psalms", name: "Salmos", chapter: 118, verse: 1 },
  ],
  forca: [
    { book: "isaiah", name: "Isaías", chapter: 41, verse: 10 },
    { book: "philippians", name: "Filipenses", chapter: 4, verse: 13 },
    { book: "psalms", name: "Salmos", chapter: 28, verse: 7 },
    { book: "psalms", name: "Salmos", chapter: 46, verse: 1 },
    { book: "isaiah", name: "Isaías", chapter: 40, verse: 29 },
    { book: "isaiah", name: "Isaías", chapter: 40, verse: 31 },
    { book: "joshua", name: "Josué", chapter: 1, verse: 9 },
    { book: "psalms", name: "Salmos", chapter: 18, verse: 2 },
  ],
};

const fallbackMessages = {
  bomdia: [
    "Que este novo dia seja cheio de paz, esperança e gratidão.",
    "A cada amanhecer, renovam-se as misericórdias e as oportunidades de ser feliz.",
    "Que o seu dia seja abençoado com luz, discernimento e passos firmes.",
  ],
  boanoite: [
    "Que a noite traga descanso ao coração e paz para o amanhã.",
    "Entregue as preocupações e descanse sob o cuidado de Deus.",
    "Uma noite serena e abençoada para recarregar as energias e a esperança.",
  ],
  fe: [
    "Confie mesmo quando ainda não consegue enxergar todo o caminho.",
    "A fé não torna as coisas mais fáceis, torna as coisas possíveis.",
    "Mantenha o coração firme: quem confia nunca caminha sozinho.",
  ],
  amor: [
    "Que o amor esteja presente nas pequenas atitudes de todos os dias.",
    "Onde existe amor sincero, floresce a paz e a compreensão.",
    "Amar é cuidar, perdoar e desejar sempre o melhor ao próximo.",
  ],
  paz: [
    "Que a paz encontre espaço dentro do seu coração hoje.",
    "A verdadeira paz é aquela que acalma o espírito em meio a qualquer tempestade.",
    "Cultive pensamentos leves e guarde o seu coração com serenidade.",
  ],
  familia: [
    "Que sua família seja sempre um lugar de amor, cuidado e união.",
    "A família é o refúgio seguro onde o amor se multiplica e o coração descansa.",
    "Que a harmonia, o carinho e a bênção de Deus estejam em cada lar.",
  ],
  gratidao: [
    "Sempre existe algo precioso pelo qual podemos agradecer hoje.",
    "Um coração grato enxerga motivos de alegria em cada detalhe da vida.",
    "A gratidão transforma o que temos no suficiente.",
  ],
  forca: [
    "Você pode atravessar este momento um dia de cada vez.",
    "A sua força é renovada a cada passo de coragem.",
    "Não tema os desafios, você foi capacitado para superar cada um deles.",
  ],
};

// Histórico de versículos recentes por categoria para não repetir
const recentVerseHistory = new Map();

export function getCategory(id) {
  return categories.find((category) => category.id === id) || categories[0];
}

export function getRandomReference(categoryId) {
  const references = bibleReferences[categoryId] || bibleReferences.bomdia;
  const history = recentVerseHistory.get(categoryId) || [];

  // Filtra referências que não foram usadas recentemente
  let available = references.filter(
    (ref) => !history.includes(`${ref.book}-${ref.chapter}-${ref.verse}`)
  );

  // Se esgotou todas as referências da categoria, reseta deixando apenas a última
  if (available.length === 0) {
    const last = history.slice(-1);
    recentVerseHistory.set(categoryId, last);
    available = references.filter(
      (ref) => !last.includes(`${ref.book}-${ref.chapter}-${ref.verse}`)
    );
  }

  if (available.length === 0) available = references;

  const selected = available[Math.floor(Math.random() * available.length)];
  const key = `${selected.book}-${selected.chapter}-${selected.verse}`;

  history.push(key);
  if (history.length > 10) history.shift();
  recentVerseHistory.set(categoryId, history);

  return selected;
}

export function getFallbackCard(categoryId) {
  const category = getCategory(categoryId);
  const msgs = fallbackMessages[category.id] || fallbackMessages.bomdia;
  const text = msgs[Math.floor(Math.random() * msgs.length)];
  return {
    category: category.id,
    categoryTitle: category.title,
    text,
    reference: `Mensagem de ${category.label.replace(/^\S+\s/, "")}`,
    source: "local",
  };
}
