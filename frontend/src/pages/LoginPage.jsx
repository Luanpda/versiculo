import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../services/api.js";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = isRegistering
        ? await api.register(form)
        : await api.login(form);
      localStorage.setItem("palavraToken", result.token);
      localStorage.setItem("palavraUser", JSON.stringify(result.user));
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
        <Link className="auth-brand" to="/">
          <span className="logo-spark">✨</span>
          <span className="logo-title">Palavra do Dia</span>
        </Link>

        <section className="auth-card">
          <span className="mini-badge">ÁREA RESTRITA</span>
          <h1>{isRegistering ? "Criar sua Conta" : "Bem-vindo(a) de volta"}</h1>
          <p className="auth-sub">
            {isRegistering
              ? "Cadastre-se para desbloquear todas as mensagens."
              : "Entre para acessar seus cartões de fé."}
          </p>

          <form onSubmit={submit} className="auth-form">
            {isRegistering && (
              <div className="input-group">
                <label>Seu Nome Completo</label>
                <input
                  required
                  placeholder="Ex: Maria Silva"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}

            <div className="input-group">
              <label>Seu E-mail</label>
              <input
                required
                type="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Sua Senha</label>
              <input
                required
                minLength="6"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="main-cta-btn auth-submit-btn" disabled={loading}>
              {loading ? "Processando..." : isRegistering ? "Criar Conta e Acessar" : "Entrar no Painel"}
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
              {isRegistering
                ? "Já tem uma conta? Clique para entrar"
                : "Ainda não tem conta? Criar cadastro agora"}
            </button>
          </div>

          <div className="auth-footer-back">
            <Link to="/">← Voltar para a página inicial</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
