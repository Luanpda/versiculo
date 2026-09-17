import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import VerseCard from "../components/VerseCard.jsx";
import { useLanguage, LanguageSelector } from "../context/LanguageContext.jsx";

export default function LandingPage() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [card, setCard] = useState(null);
  const [category, setCategory] = useState("bomdia");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load categories and card whenever language changes
  useEffect(() => {
    let isMounted = true;
    api.getCategories(lang)
      .then((cats) => {
        if (isMounted) setCategories(cats);
      })
      .catch(() => {});

    setLoading(true);
    api.getRandomCard(category, lang)
      .then((newCard) => {
        if (isMounted) setCard(newCard);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lang]);

  async function chooseCategory(id) {
    setCategory(id);
    setLoading(true);
    try {
      setCard(await api.getRandomCard(id, lang));
    } finally {
      setLoading(false);
    }
  }

  function copyVerseText() {
    if (!card) return;
    const textToCopy = `“${card.text}” — ${card.reference}\n\n${t.meta.copyFooter}`;
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
            <span className="logo-title">{t.meta.brandName}</span>
          </Link>
          <div className="header-right">
            <LanguageSelector />
            <Link className="header-login-btn" to="/login">
              {t.nav.login}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>⭐ {t.hero.badge}</span>
          </div>

          <h1 className="hero-headline">
            {t.hero.titlePart1}
            <span className="highlight-text">{t.hero.titleHighlight}</span>
            {t.hero.titlePart2}
          </h1>

          <p className="hero-subheadline">{t.hero.subtitle}</p>

          <div className="hero-cta-group">
            <a className="main-cta-btn" href="#experimente">
              <span>✨ {t.hero.ctaButton}</span>
              <span className="cta-arrow">↓</span>
            </a>
            <span className="cta-subtext">{t.hero.ctaSubtext}</span>
          </div>
        </section>

        {/* GERADOR INTERATIVO (EXPERIMENTE AGORA) */}
        <section className="app-section" id="experimente">
          <div className="section-header">
            <span className="mini-badge">{t.generator.badge}</span>
            <h2>{t.generator.title}</h2>
            <p>{t.generator.subtitle}</p>
          </div>

          <div className="app-card-container">
            {/* Seletor de Categorias */}
            <div className="categories-slider">
              {categories.map((item) => (
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
                  <p>{t.generator.loadingText}</p>
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
                  {t.generator.anotherBtn}
                </button>
                <button
                  className={`action-btn outline ${copied ? "copied" : ""}`}
                  onClick={copyVerseText}
                >
                  {copied ? t.generator.copiedBtn : t.generator.copyBtn}
                </button>
              </div>
            )}

            {/* Banner de Demonstração */}
            <div className="trial-notice">
              <div className="trial-info">
                <strong>{t.generator.trialTitle}</strong>
                <p>{t.generator.trialDesc}</p>
              </div>
              <a className="trial-upgrade-btn" href="#comprar">
                {t.generator.trialCta}
              </a>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS REAIS / POR QUE USAR */}
        <section className="features-section">
          <div className="section-header">
            <span className="mini-badge">{t.features.badge}</span>
            <h2>{t.features.title}</h2>
            <p>{t.features.subtitle}</p>
          </div>

          <div className="features-grid">
            {t.features.items.map((feat, idx) => (
              <div className="feature-box" key={idx}>
                <div className="feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO DE OFERTA / VENDA DE ALTA CONVERSÃO */}
        <section className="sales-section" id="comprar">
          <div className="offer-wrapper">
            <div className="offer-header">
              <span className="offer-pill">{t.pricing.banner}</span>
              <h2>{t.pricing.title}</h2>
              <p>{t.pricing.subtitle}</p>
            </div>

            <div className="offer-body">
              <div className="offer-details">
                <h3>{t.pricing.benefitsTitle}</h3>
                <ul className="offer-checklist">
                  {t.pricing.benefits.map((benefit, idx) => (
                    <li key={idx}>
                      <span className="check-icon">✓</span>
                      <div>
                        <strong>{benefit.title}</strong>
                        <span>{benefit.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CARD DE PREÇO & CHECKOUT */}
              <div className="pricing-card">
                <div className="pricing-tag">{t.pricing.discountTag}</div>

                <div className="pricing-price">
                  <span className="price-old">{t.pricing.oldPrice}</span>
                  <div className="price-current">
                    <span className="currency">{t.pricing.currency}</span>
                    <span className="amount">{t.pricing.amount}</span>
                    <span className="cents">{t.pricing.cents}</span>
                  </div>
                  <span className="price-frequency">{t.pricing.frequency}</span>
                </div>

                {lang === "pt" ? (
                  <a
                    className="checkout-btn"
                    href="https://pay.hotmart.com/I107609448I?checkoutMode=10"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{t.pricing.cta}</span>
                  </a>
                ) : (
                  <Link className="checkout-btn" to="/login">
                    <span>{t.pricing.cta}</span>
                  </Link>
                )}

                <div className="pricing-guarantees">
                  {t.pricing.guarantees.map((g, idx) => (
                    <div className="guarantee-item" key={idx}>
                      <span>{g.icon}</span>
                      <span>
                        <strong>{g.title}</strong> {g.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS AUTÊNTICOS */}
        <section className="testimonials-section">
          <div className="section-header">
            <span className="mini-badge">{t.testimonials.badge}</span>
            <h2>{t.testimonials.title}</h2>
          </div>

          <div className="testimonials-grid">
            {t.testimonials.items.map((item, idx) => (
              <div className="testimonial-card" key={idx}>
                <div className="testimonial-stars">★★★★★</div>
                <p>{item.text}</p>
                <div className="testimonial-author">
                  <img className="author-avatar" src={item.avatar} alt={item.author} />
                  <div>
                    <strong>{item.author}</strong>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="faq-section">
          <div className="section-header">
            <span className="mini-badge">{t.faq.badge}</span>
            <h2>{t.faq.title}</h2>
          </div>

          <div className="faq-container">
            {t.faq.items.map((item, idx) => (
              <details className="faq-item" key={idx}>
                <summary>{item.q}</summary>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">✨ {t.meta.brandName}</span>
            <p>{t.meta.tagline}</p>
          </div>
          <div className="footer-copyright">
            <p>
              © {new Date().getFullYear()} {t.meta.brandName}.{" "}
              {lang === "pt"
                ? "Todos os direitos reservados."
                : lang === "es"
                ? "Todos los derechos reservados."
                : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
