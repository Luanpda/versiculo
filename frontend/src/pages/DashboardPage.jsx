import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function DashboardPage() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("bomdia");
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [variation, setVariation] = useState(1);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("palavraUser") || "{}"));

  useEffect(() => {
    let isMounted = true;
    let pollInterval;

    function fetchUserProfile() {
      api.getMe()
        .then((data) => {
          if (data && data.user && isMounted) {
            setUser(data.user);
            localStorage.setItem("palavraUser", JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }

    fetchUserProfile();

    if (!user.isPaid) {
      pollInterval = setInterval(fetchUserProfile, 3000);
    }

    api.getCategories(lang)
      .then((cats) => {
        if (isMounted) setCategories(cats);
      })
      .catch(() => {});

    if (user.isPaid) {
      setLoading(true);
      api.getPremiumCard(category, lang)
        .then((newCard) => {
          if (isMounted) {
            setCard(newCard);
            setVariation(Math.floor(Math.random() * 10) + 1);
          }
        })
        .catch((error) => {
          if (error.message.includes("Sessão") || error.message.includes("login")) logout();
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [lang, user.isPaid]);

  async function chooseCategory(id) {
    setCategory(id);
    setLoading(true);
    try {
      setCard(await api.getPremiumCard(id, lang));
      setVariation(Math.floor(Math.random() * 10) + 1);
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

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

  function logout() {
    localStorage.removeItem("palavraToken");
    localStorage.removeItem("palavraUser");
    navigate("/");
  }

  const [showHotmartModal, setShowHotmartModal] = useState(false);

  return (
    <div className="dashboard-page">
      {showHotmartModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '12px', color: '#241a13', fontWeight: '800' }}>Aviso Importante!</h3>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
              Para que seu acesso Premium seja liberado automaticamente, <strong>você deve utilizar o mesmo e-mail</strong> na Hotmart que usou para criar esta conta:
            </p>
            <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px', marginBottom: '24px', fontWeight: '700', color: '#333' }}>
              {user?.email}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`https://pay.hotmart.com/I107609448I?checkoutMode=10&email=${user?.email || ''}`}
                target="_blank"
                rel="noreferrer"
                className="main-cta-btn"
                style={{ textDecoration: "none", width: '100%', display: 'block' }}
                onClick={() => setShowHotmartModal(false)}
              >
                Ir para o Pagamento
              </a>
              <button 
                onClick={() => setShowHotmartModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#888', fontWeight: '600', padding: '10px', cursor: 'pointer' }}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
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

        <div style={{ textAlign: "center", marginBottom: "8px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>TEMA BÍBLICO</div>
        <div className="categories-slider dashboard-categories">
          {categories.map((item) => (
            <button
              className={`category-pill ${category === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => chooseCategory(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CategoryIcon id={item.id} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Área do Cartão ou Paywall */}
        <div className="dashboard-card-wrap">
          {!user.isPaid ? (
            <div className="paywall-container" style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "12px", border: "2px dashed #ccc" }}>
              <span className="mini-badge" style={{ marginBottom: "1rem" }}>ACESSO PREMIUM NECESSÁRIO</span>
              <h2 style={{ marginBottom: "1rem", color: "#333" }}>Desbloqueie seu acesso!</h2>
              <p style={{ marginBottom: "2rem", color: "#666" }}>
                Você já criou sua conta e está quase lá. Para liberar as categorias, baixar fotos em HD sem limite e gerar imagens, você precisa ativar o seu acesso Premium.
              </p>
              <button
                className="main-cta-btn"
                style={{ display: "inline-block", textDecoration: "none", cursor: "pointer", border: "none" }}
                onClick={() => setShowHotmartModal(true)}
              >
                Ativar Acesso Premium
              </button>
              <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "1rem" }}>
                Após o pagamento, o seu acesso será liberado automaticamente aqui mesmo!
              </p>
            </div>
          ) : loading ? (
            <div className="card-skeleton">
              <div className="spinner"></div>
              <p>{t.dashboard.loadingText}</p>
            </div>
          ) : (
            <>
              <VerseCard card={card} ref={cardRef} variation={variation} />

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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
