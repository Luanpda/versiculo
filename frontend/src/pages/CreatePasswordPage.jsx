import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function CreatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não são iguais.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.setPassword(password);
      localStorage.setItem("palavraToken", result.token);
      localStorage.setItem("palavraUser", JSON.stringify(result.user));
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <section className="auth-card">
          <span className="mini-badge">Universo de Fé</span>
          <h1>Crie sua senha 🙏</h1>
          <p className="auth-sub">
            Seu pagamento foi confirmado. Crie uma senha para entrar normalmente
            pelo site nas próximas vezes.
          </p>

          <form onSubmit={submit} className="auth-form">
            <div className="input-group">
              <label>Nova senha</label>
              <input
                required
                minLength="6"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Confirme sua senha</label>
              <input
                required
                minLength="6"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="main-cta-btn auth-submit-btn" disabled={loading}>
              {loading ? "Salvando..." : "Criar senha e acessar"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
