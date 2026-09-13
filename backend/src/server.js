import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import cardRoutes from "./routes/cards.js";
import imageRoutes from "./routes/images.js";
import geoRoutes from "./routes/geo.js";

const app = express();
const port = process.env.PORT || 3001;

// 1. Cabeçalhos de Segurança HTTP (Helmet)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. Limite de tamanho de payload para prevenir DoS
app.use(express.json({ limit: "1mb" }));

// 3. Configuração de CORS (autoriza chamadas locais e na Vercel)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// 4. Conexão automática e resiliente com o MongoDB
app.use(async (_req, _res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDatabase();
    } catch (error) {
      console.warn("Aviso MongoDB:", error.message);
    }
  }
  next();
});

// 5. Rate Limiting Geral
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas requisições. Aguarde um momento." },
});
app.use("/api/", generalLimiter);

// 6. Rate Limiting para Autenticação (prevenção de força bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas tentativas de login. Aguarde alguns minutos." },
});
app.use("/api/auth/", authLimiter);

// Rota de Health Check
app.get("/api/health", (_request, response) =>
  response.json({ status: "ok", timestamp: new Date().toISOString() })
);

// Agrupamento de rotas
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/geo", geoRoutes);

// Tratamento global de erros
app.use((err, _request, response, _next) => {
  console.error("Erro no backend:", err.message);
  return response.status(500).json({ message: "Ocorreu um erro interno no servidor." });
});

// Inicia o servidor em ambiente local (não-serverless)
if (!process.env.VERCEL) {
  connectDatabase()
    .then(() => {
      app.listen(port, () =>
        console.log(`API segura rodando em http://localhost:${port}`)
      );
    })
    .catch((err) => console.error("Erro na inicialização:", err));
}

export default app;
