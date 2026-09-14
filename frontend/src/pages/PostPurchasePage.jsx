import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";

export default function PostPurchasePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [transaction, setTransaction] = useState(searchParams.get("transaction") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const e = searchParams.get("email");
    const t = searchParams.get("transaction");
    if (e && t) enter(e, t);
  }, []);

  async function enter(e = email, t = transaction) {
    setError("");
    if (!e || !t) {
      setError("Não foi possível identificar automaticamente a compra. Informe o e-mail e a transação da Hotmart.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.hotmartAccess({ email: e, transaction: t });
      localStorage.setItem("palavraToken", result.token);
      localStorage.setItem("palavraUser", JSON.stringify(result.user));

      if (result.user?.needsPasswordSetup) {
        navigate("/criar-senha", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
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
          <h1>Seu acesso está quase pronto 🙏</h1>
          <p className="auth-sub">
            Se a Hotmart enviou os dados da compra para esta página, o acesso será liberado automaticamente.
          </p>

          <form onSubmit={(event) => { event.preventDefault(); enter(); }} className="auth-form">
            <div className="input-group">
              <label>E-mail usado na compra</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Transação Hotmart</label>
              <input required value={transaction} onChange={(e) => setTransaction(e.target.value)} placeholder="Ex.: HP..." />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button className="main-cta-btn auth-submit-btn" disabled={loading}>
              {loading ? "Liberando acesso..." : "Entrar no Universo de Fé"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
