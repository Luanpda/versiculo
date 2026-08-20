import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "versiculo_jwt_secret_key_2026_segura";

export function requireAuth(request, response, next) {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return response.status(401).json({ message: "Faça login para continuar." });
  }

  try {
    request.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return response.status(401).json({ message: "Sessão inválida. Entre novamente." });
  }
}

// Middleware para rotas exclusivas do Administrador
export function requireAdmin(request, response, next) {
  requireAuth(request, response, () => {
    if (request.user?.role !== "admin") {
      return response.status(403).json({ message: "Acesso restrito ao Administrador." });
    }
    next();
  });
}
