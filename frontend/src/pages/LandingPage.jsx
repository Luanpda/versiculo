import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { api } from "../services/api.js";
import VerseCard from "../components/VerseCard.jsx";
import { useLanguage, LanguageSelector } from "../context/LanguageContext.jsx";
import { Sun, Moon, Anchor, Heart, Feather, Users, Sparkles, Shield } from "lucide-react";

const CategoryIcon = ({ id }) => {
  switch (id) {
    case 'bomdia': return <Sun size={16} />;
    case 'boanoite': return <Moon size={16} />;
    case 'fe': return <Anchor size={16} />;
    case 'amor': return <Heart size={16} />;
    case 'paz': return <Feather size={16} />;
    case 'familia': return <Users size={16} />;
    case 'gratidao': return <Sparkles size={16} />;
    case 'forca': return <Shield size={16} />;
    default: return null;
  }
};

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

  const [generations, setGenerations] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  async function chooseCategory(id) {
    if (generations >= 1) {
      setShowModal(true);
      return;
    }
    setCategory(id);
    setLoading(true);
    try {
      setCard(await api.getRandomCard(id, lang));
      setGenerations(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  async function downloadCard() {
    if (downloads >= 1) {
      setShowModal(true);
      return;
    }
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      const prefix = t.meta.filePrefix || "palavra-do-dia";
      link.download = `${prefix}-${category}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloads(prev => prev + 1);
    } catch (err) {
      console.error("Erro ao baixar imagem:", err);
    } finally {
      setDownloading(false);
    }
  }

  const [sharing, setSharing] = useState(false);

  async function shareWhatsApp() {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null,
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'palavra-do-dia.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t.meta.brandName || 'Palavra do Dia',
        });
      } else {
        alert(lang === 'pt' ? 'Seu navegador não suporta compartilhamento direto de imagens. A imagem será baixada para você enviar manualmente.' : 'Your browser does not support direct image sharing. The image will be downloaded for you to send manually.');
        const link = document.createElement("a");
        const prefix = t.meta.filePrefix || "palavra-do-dia";
        link.download = `${prefix}-${category}-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        const url = `https://api.whatsapp.com/send`;
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error("Erro ao compartilhar imagem:", err);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="page-wrapper">
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '12px', color: '#241a13', fontWeight: '800' }}>
              {lang === 'pt' ? 'Limite Atingido' : lang === 'es' ? 'Límite Alcanzado' : 'Limit Reached'}
            </h3>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px', lineHeight: '1.5' }}>
              {lang === 'pt' ? 'Você atingiu o limite da versão gratuita. Crie sua conta para baixar fotos HD sem limites e ter acesso a todas as categorias!' : 
               lang === 'es' ? 'Has alcanzado el límite de la versión gratuita. ¡Crea tu cuenta para descargar fotos HD sin límites y acceder a todas las categorías!' : 
               'You have reached the free version limit. Create your account to download unlimited HD photos and access all categories!'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/login?register=true"
                className="main-cta-btn"
                style={{ textDecoration: "none", width: '100%', display: 'block' }}
              >
                {lang === 'pt' ? 'Criar uma conta para acessar' : lang === 'es' ? 'Crear una cuenta para acceder' : 'Create an account to access'}
              </Link>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#888', fontWeight: '600', padding: '10px', cursor: 'pointer' }}
              >
                {lang === 'pt' ? 'Voltar' : lang === 'es' ? 'Volver' : 'Back'}
              </button>
            </div>
          </div>
        </div>
      )}
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
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CategoryIcon id={item.id} />
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
                <VerseCard card={card} ref={cardRef} />
              )}
            </div>

            {/* Ações Rápidas */}
            {card && !loading && (
              <div className="card-quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="main-cta-btn download-btn"
                  style={{ width: '100%', border: 'none', cursor: 'pointer' }}
                  onClick={downloadCard}
                  disabled={downloading}
                >
                  {downloading ? (t.dashboard?.savingBtn || 'Salvando...') : (t.dashboard?.downloadBtn || '⬇ Baixar Imagem')}
                </button>

                <div className="secondary-actions-row" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    className="action-btn secondary"
                    onClick={() => chooseCategory(category)}
                  >
                    {t.generator.anotherBtn}
                  </button>
                  <button
                    className="action-btn outline"
                    style={{ borderColor: '#25D366', color: '#25D366' }}
                    onClick={shareWhatsApp}
                    disabled={sharing}
                  >
                    {sharing ? 'Compartilhando...' : 'WhatsApp'}
                  </button>
                </div>
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

                <Link className="checkout-btn" to="/login?register=true">
                  <span>{t.pricing.cta}</span>
                </Link>

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
