import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { api } from "../services/api.js";
import { useLanguage, LanguageSelector } from "../context/LanguageContext.jsx";

export default function LoginPage() {
  const { lang, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(location.search.includes("register=true"));
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = isRegistering ? { ...form, language: lang } : form;
      const result = isRegistering
        ? await api.register(payload)
        : await api.login(payload);

      localStorage.setItem("palavraToken", result.token);
      localStorage.setItem("palavraUser", JSON.stringify(result.user));

      if (result.user?.language) {
        changeLanguage(result.user.language);
      }

      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header-row">
          <Link className="auth-brand" to="/">
            <span className="logo-spark">✨</span>
            <span className="logo-title">{t.meta.brandName}</span>
          </Link>
          <LanguageSelector className="auth-lang-selector" />
        </div>

          <section className="auth-card">
            <span className="mini-badge">{t.auth.restrictedBadge}</span>
            <h1>{isRegistering ? t.auth.registerTitle : t.auth.loginTitle}</h1>
            <p className="auth-sub">
              {isRegistering ? t.auth.registerSub : t.auth.loginSub}
            </p>

            <form onSubmit={submit} className="auth-form">
              {isRegistering && (
                <div className="input-group">
                  <label>{t.auth.nameLabel}</label>
                  <input
                    required
                    placeholder={t.auth.namePlaceholder}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              )}

              <div className="input-group">
                <label>{t.auth.emailLabel}</label>
                <input
                  required
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>{t.auth.passwordLabel}</label>
                <input
                  required
                  minLength="6"
                  type="password"
                  placeholder={t.auth.passwordPlaceholder}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="main-cta-btn auth-submit-btn" disabled={loading}>
                {loading
                  ? t.auth.processing
                  : isRegistering
                  ? t.auth.registerBtn
                  : t.auth.loginBtn}
              </button>
            </form>

            <div className="auth-toggle">
              <button
                type="button"
                className="toggle-link"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
              >
                {isRegistering ? t.auth.toLogin : t.auth.toRegister}
              </button>
            </div>

            <div className="auth-footer-back">
              <Link to="/">{t.nav.backHome}</Link>
            </div>
          </section>
      </div>
    </div>
  );
}
