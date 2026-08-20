import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import VerseCard from "../components/VerseCard.jsx";

const defaultCategories = [
  { id: "bomdia", label: "🌅 Bom Dia" },
  { id: "boanoite", label: "🌙 Boa Noite" },
  { id: "fe", label: "🙏 Fé" },
  { id: "amor", label: "❤️ Amor" },
  { id: "paz", label: "🕊️ Paz" },
  { id: "familia", label: "👨‍👩‍👧 Família" },
  { id: "gratidao", label: "✨ Gratidão" },
  { id: "forca", label: "💪 Força" },
];

export default function LandingPage() {
  const [card, setCard] = useState(null);
  const [category, setCategory] = useState("bomdia");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function chooseCategory(id) {
    setCategory(id);
    setLoading(true);
    try {
      setCard(await api.getRandomCard(id));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    chooseCategory("bomdia");
  }, []);

  function copyVerseText() {
    if (!card) return;
    const textToCopy = `“${card.text}” — ${card.reference}\n\n✨ Mensagem do dia via Palavra do Dia`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="page-wrapper">
      {/* Header Fixo e Elegante */}
      <header className="site-header">
        <div className="header-container">
          <Link className="brand-logo" to="/">
            <span className="logo-spark">✨</span>
            <span className="logo-title">Palavra do Dia</span>
          </Link>
          <div className="header-right">
            <Link className="header-login-btn" to="/login">
              Entrar na Conta
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>⭐ Mais de 14.800 pessoas abençoadas diariamente</span>
          </div>

          <h1 className="hero-headline">
            Mensagens Bíblicas que <span className="highlight-text">Tocam a Alma</span>, Prontas para Compartilhar.
          </h1>

          <p className="hero-subheadline">
            Escolha o momento, gere versículos inspiradores com fotos em altíssima definição e espalhe fé, amor e esperança no WhatsApp e Instagram em segundos.
          </p>

          <div className="hero-cta-group">
            <a className="main-cta-btn" href="#experimente">
              <span>✨ Experimentar Gratuitamente</span>
              <span className="cta-arrow">↓</span>
            </a>
            <span className="cta-subtext">🔒 Sem cadastro • Teste direto no navegador</span>
          </div>
        </section>

        {/* GERADOR INTERATIVO (EXPERIMENTE AGORA) */}
        <section className="app-section" id="experimente">
          <div className="section-header">
            <span className="mini-badge">DEMONSTRAÇÃO AO VIVO</span>
            <h2>O que você quer compartilhar hoje?</h2>
            <p>Clique em uma categoria abaixo e veja a mensagem se formar instantaneamente.</p>
          </div>

          <div className="app-card-container">
            {/* Seletor de Categorias */}
            <div className="categories-slider">
              {defaultCategories.map((item) => (
                <button
                  key={item.id}
                  className={`category-pill ${category === item.id ? "active" : ""}`}
                  onClick={() => chooseCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Visualização do Cartão */}
            <div className="card-display-area">
              {loading ? (
                <div className="card-skeleton">
                  <div className="spinner"></div>
                  <p>Buscando versículo e foto em alta resolução...</p>
                </div>
              ) : (
                <VerseCard card={card} />
              )}
            </div>

            {/* Ações Rápidas */}
            {card && !loading && (
              <div className="card-quick-actions">
                <button
                  className="action-btn secondary"
                  onClick={() => chooseCategory(category)}
                >
                  🔄 Outra Foto e Mensagem
                </button>
                <button
                  className={`action-btn outline ${copied ? "copied" : ""}`}
                  onClick={copyVerseText}
                >
                  {copied ? "✓ Copiado para a Área de Transferência!" : "📋 Copiar Texto"}
                </button>
              </div>
            )}

            {/* Banner de Demonstração */}
            <div className="trial-notice">
              <div className="trial-info">
                <strong>Você está no modo de demonstração.</strong>
                <p>Desbloqueie acesso completo com centenas de versículos, fotos ilimitadas e downloads em alta qualidade para celular.</p>
              </div>
              <a className="trial-upgrade-btn" href="#comprar">
                Quero Acesso Completo
              </a>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS REAIS / POR QUE USAR */}
        <section className="features-section">
          <div className="section-header">
            <span className="mini-badge">FACILIDADE NO SEU DIA</span>
            <h2>Feito para quem ama abençoar a vida de outras pessoas</h2>
            <p>Esqueça perder tempo procurando imagens no Google ou cortando mensagens.</p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">📱</div>
              <h3>Pronto para WhatsApp & Instagram</h3>
              <p>Formato perfeito para Status, Stories e grupos de oração da família. Baixe em 1 clique e envie direto.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🌅</div>
              <h3>Fotografias Profissionais em HD</h3>
              <p>Acervo curado com paisagens, momentos de família e luz natural para valorizar cada versículo com respeito e beleza.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">📖</div>
              <h3>Bíblia Fiel em Português</h3>
              <p>Versículos organizados por sentimentos e ocasiões: Bom Dia, Gratidão, Força nas lutas, Paz e Amor.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <h3>Pronto em 3 Segundos</h3>
              <p>Não precisa instalar aplicativos pesados. Abra pelo navegador do celular onde e quando quiser.</p>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE OFERTA / VENDA DE ALTA CONVERSÃO */}
        <section className="sales-section" id="comprar">
          <div className="offer-wrapper">
            <div className="offer-header">
              <span className="offer-pill">🔥 OFERTA DE LANÇAMENTO • ACESSO VITALÍCIO</span>
              <h2>Tenha o Criador de Mensagens de Fé Completo para Sempre</h2>
              <p>Comece o dia compartilhando a palavra de Deus com quem você mais ama.</p>
            </div>

            <div className="offer-body">
              <div className="offer-details">
                <h3>O que você recebe ao desbloquear seu acesso:</h3>
                <ul className="offer-checklist">
                  <li>
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>Acesso Ilimitado e Vitalício</strong>
                      <span>Pague uma única vez e use para sempre, sem mensalidades.</span>
                    </div>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>Downloads em Alta Definição (PNG)</strong>
                      <span>Salve no seu celular ou computador sem perder qualidade.</span>
                    </div>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>Mais de 60 Versículos & Acervo Contínuo</strong>
                      <span>Categorias de Bom Dia, Boa Noite, Fé, Família, Amor, Força e Gratidão.</span>
                    </div>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>Sem Anúncios e Sem Interrupções</strong>
                      <span>Experiência limpa, rápida e 100% focada na mensagem.</span>
                    </div>
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>Área de Membros Exclusiva</strong>
                      <span>Seu login protegido para acessar de qualquer aparelho.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* CARD DE PREÇO & CHECKOUT */}
              <div className="pricing-card">
                <div className="pricing-tag">DESCONTO DE 50% HOJE</div>
                
                <div className="pricing-price">
                  <span className="price-old">De R$ 29,90</span>
                  <div className="price-current">
                    <span className="currency">R$</span>
                    <span className="amount">14</span>
                    <span className="cents">,90</span>
                  </div>
                  <span className="price-frequency">Pagamento único • Sem assinaturas</span>
                </div>

                <Link className="checkout-btn" to="/login">
                  <span>🔓 DESBLOQUEAR MEU ACESSO AGORA</span>
                </Link>

                <div className="pricing-guarantees">
                  <div className="guarantee-item">
                    <span>🛡️</span>
                    <span><strong>Garantia de 7 Dias:</strong> 100% de satisfação ou seu dinheiro de volta.</span>
                  </div>
                  <div className="guarantee-item">
                    <span>⚡</span>
                    <span><strong>Liberação Imediata:</strong> Crie sua conta e comece agora mesmo.</span>
                  </div>
                  <div className="guarantee-item">
                    <span>🔒</span>
                    <span><strong>Pagamento Seguro:</strong> Ambiente protegido com criptografia.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS AUTÊNTICOS */}
        <section className="testimonials-section">
          <div className="section-header">
            <span className="mini-badge">QUEM USA RECOMENDA</span>
            <h2>Veja o que dizem as pessoas que já usam</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p>“Envio todos os dias às 6h da manhã no grupo da minha família. Todo mundo acorda e já comenta a foto bonita e o versículo do dia. Transformou nossa rotina!”</p>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div>
                  <strong>Cláudia Mendes</strong>
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p>“Uso para colocar nos Status do WhatsApp da igreja e no meu Instagram pessoal. As fotos são maravilhosas e combinam muito com cada texto bíblico.”</p>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💼</div>
                <div>
                  <strong>Pastor Marcos Roberto</strong>
                  <span>Belo Horizonte, MG</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p>“Prático demais! Antes eu ficava caçando mensagem no Google e vinha com imagem borrada. Agora eu clico e em 3 segundos tá pronto pra mandar.”</p>
              <div className="testimonial-author">
                <div className="author-avatar">👱‍♀️</div>
                <div>
                  <strong>Ana Beatriz Souza</strong>
                  <span>Curitiba, PR</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="faq-section">
          <div className="section-header">
            <span className="mini-badge">DÚVIDAS FREQUENTES</span>
            <h2>Perguntas Comuns</h2>
          </div>

          <div className="faq-container">
            <details className="faq-item">
              <summary>Preciso instalar algum aplicativo no celular?</summary>
              <div className="faq-answer">
                <p>Não! O Palavra do Dia roda direto no navegador do seu celular, tablet ou computador. Você pode criar um atalho na tela inicial se quiser.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Como faço para enviar a imagem no WhatsApp?</summary>
              <div className="faq-answer">
                <p>Basta clicar no botão "Baixar imagem" para salvar o cartão em PNG no seu aparelho e depois enviar no WhatsApp, Status ou Instagram como qualquer foto.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>O pagamento é mensal ou único?</summary>
              <div className="faq-answer">
                <p>O pagamento de R$ 14,90 é <strong>único</strong>! Você não pagará mensalidades e terá acesso vitalício a todas as mensagens e atualizações.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>E se eu não gostar? Tenho garantia?</summary>
              <div className="faq-answer">
                <p>Sim! Você tem 7 dias de garantia incondicional. Se não gostar, basta solicitar o reembolso integral sem burocracia.</p>
              </div>
            </details>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">✨ Palavra do Dia</span>
            <p>Edificando vidas e transmitindo amor através da palavra de Deus.</p>
          </div>
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} Palavra do Dia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
