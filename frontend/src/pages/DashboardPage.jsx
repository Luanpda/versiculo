import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { api } from "../services/api.js";
import VerseCard from "../components/VerseCard.jsx";
import { useLanguage, LanguageSelector } from "../context/LanguageContext.jsx";

export default function DashboardPage() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("bomdia");
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("palavraUser") || "{}");

  useEffect(() => {
    let isMounted = true;
    api.getCategories(lang)
      .then((cats) => {
        if (isMounted) setCategories(cats);
      })
      .catch(() => {});

    setLoading(true);
    api.getPremiumCard(category, lang)
      .then((newCard) => {
        if (isMounted) setCard(newCard);
      })
      .catch((error) => {
        if (error.message.includes("Sessão") || error.message.includes("login")) logout();
      })
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
      setCard(await api.getPremiumCard(id, lang));
    } catch (error) {
      if (error.message.includes("Sessão") || error.message.includes("login")) logout();
    } finally {
      setLoading(false);
    }
  }

  async function downloadCard() {
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
    } catch (err) {
      console.error("Erro ao baixar imagem:", err);
    } finally {
      setDownloading(false);
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

  function logout() {
    localStorage.removeItem("palavraToken");
    localStorage.removeItem("palavraUser");
    navigate("/");
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-container">
          <div className="brand-logo">
            <span className="logo-spark">✨</span>
            <span className="logo-title">{t.meta.brandName}</span>
            <span className="premium-badge">
              {user.role === "admin" ? t.nav.adminBadge : t.nav.premiumBadge}
            </span>
          </div>

          <div className="user-profile">
            <LanguageSelector />
            <span className="user-name">
              {t.nav.hello}, {user.name || "Usuário"}
            </span>
            <button className="logout-btn" onClick={logout}>
              {t.nav.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-hero">
          <span className="mini-badge">{t.dashboard.badge}</span>
          <h1>{t.dashboard.title}</h1>
          <p>{t.dashboard.subtitle}</p>
        </div>

        {/* Seletor de Categorias */}
        <div className="categories-slider dashboard-categories">
          {categories.map((item) => (
            <button
              className={`category-pill ${category === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => chooseCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Área do Cartão */}
        <div className="dashboard-card-wrap">
          {loading ? (
            <div className="card-skeleton">
              <div className="spinner"></div>
              <p>{t.dashboard.loadingText}</p>
            </div>
          ) : (
            <>
              <VerseCard card={card} ref={cardRef} />

              <div className="dashboard-actions">
                <button
                  className="main-cta-btn download-btn"
                  onClick={downloadCard}
                  disabled={downloading}
                >
                  {downloading ? t.dashboard.savingBtn : t.dashboard.downloadBtn}
                </button>

                <div className="secondary-actions-row">
                  <button
                    className="action-btn secondary"
                    onClick={() => chooseCategory(category)}
                  >
                    {t.dashboard.anotherBtn}
                  </button>
                  <button
                    className={`action-btn outline ${copied ? "copied" : ""}`}
                    onClick={copyVerseText}
                  >
                    {copied ? t.dashboard.copiedBtn : t.dashboard.copyBtn}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
