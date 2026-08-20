import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPaid: user.isPaid,
      plan: user.plan,
    },
    process.env.JWT_SECRET || "versiculo_jwt_secret_key_2026_segura",
    { expiresIn: "7d" }
  );
}

// Rota de Cadastro de Novos Usuários
router.post("/register", async (request, response) => {
  try {
    const { name, email, password } = request.body;

    // Proteção contra NoSQL Injection e tipos inválidos
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return response
        .status(400)
        .json({ message: "Dados em formato inválido." });
    }

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password;

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return response
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return response
        .status(400)
        .json({ message: "Informe um e-mail com formato válido." });
    }

    if (cleanPassword.length < 6 || cleanPassword.length > 128) {
      return response
        .status(400)
        .json({ message: "A senha deve ter entre 6 e 128 caracteres." });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return response
        .status(409)
        .json({ message: "Este e-mail já está cadastrado." });
    }

    const user = new User({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: "user",
      isPaid: false,
      plan: "free",
    });

    await user.save();

    return response.status(201).json({
      message: "Conta criada com sucesso!",
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPaid: user.isPaid,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Erro no cadastro:", error.message);
    return response
      .status(500)
      .json({ message: "Erro interno no servidor ao cadastrar." });
  }
});

// Rota de Login
router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    // Proteção contra NoSQL Injection e tipos inválidos
    if (typeof email !== "string" || typeof password !== "string") {
      return response
        .status(400)
        .json({ message: "Dados em formato inválido." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      return response
        .status(400)
        .json({ message: "Informe seu e-mail e sua senha." });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return response
        .status(401)
        .json({ message: "E-mail ou senha incorretos." });
    }

    const isMatch = await user.comparePassword(cleanPassword);
    if (!isMatch) {
      return response
        .status(401)
        .json({ message: "E-mail ou senha incorretos." });
    }

    return response.json({
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPaid: user.isPaid,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return response
      .status(500)
      .json({ message: "Erro interno no servidor ao processar login." });
  }
});

// Rota para consultar dados do usuário autenticado
router.get("/me", requireAuth, async (request, response) => {
  try {
    const user = await User.findById(request.user.id);
    if (!user) {
      return response.status(404).json({ message: "Usuário não encontrado." });
    }
    return response.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPaid: user.isPaid,
        plan: user.plan,
      },
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Erro ao carregar dados do usuário." });
  }
});

export default router;
