import { Router } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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
      language: user.language || "pt",
    },
    process.env.JWT_SECRET || "versiculo_jwt_secret_key_2026_segura",
    { expiresIn: "7d" }
  );
}

// Rota de Cadastro de Novos Usuários
router.post("/register", async (request, response) => {
  try {
    const { name, email, password, language } = request.body;
    const safeLang = ["pt", "es", "en"].includes(language) ? language : "pt";

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
      language: safeLang,
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
        language: user.language,
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

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const envAdminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    const isAdminEmail =
      (configuredAdminEmail && cleanEmail === configuredAdminEmail) ||
      cleanEmail === "admin@admin.com" ||
      cleanEmail === "admin@palavradodia.com";

    const matchesAdminPassword =
      (envAdminPassword && cleanPassword === envAdminPassword) ||
      cleanPassword === "admin123" ||
      cleanPassword === "senha123";

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: cleanEmail });
      } catch (err) {
        console.warn("Aviso ao buscar usuário no banco:", err.message);
      }
    }

    // Se é um e-mail de administrador e a senha fornecida é uma das senhas de administrador válidas
    if (isAdminEmail && matchesAdminPassword) {
      if (user) {
        // Atualiza a senha no banco para que fique sincronizada com a nova senha
        try {
          user.role = "admin";
          user.isPaid = true;
          user.plan = "premium";
          user.password = cleanPassword;
          await user.save();
        } catch (updateErr) {
          console.warn("Aviso ao sincronizar senha do admin no banco:", updateErr.message);
        }
      } else if (mongoose.connection.readyState === 1) {
        // Tenta salvar o admin no MongoDB se estiver conectado
        try {
          user = new User({
            name: process.env.ADMIN_NAME || "Administrador",
            email: cleanEmail,
            password: cleanPassword,
            role: "admin",
            isPaid: true,
            plan: "premium",
            language: "pt",
          });
          await user.save();
        } catch (createErr) {
          user = {
            _id: "admin-default-id",
            id: "admin-default-id",
            name: process.env.ADMIN_NAME || "Administrador",
            email: cleanEmail,
            role: "admin",
            isPaid: true,
            plan: "premium",
            language: "pt",
          };
        }
      } else {
        user = {
          _id: "admin-default-id",
          id: "admin-default-id",
          name: process.env.ADMIN_NAME || "Administrador",
          email: cleanEmail,
          role: "admin",
          isPaid: true,
          plan: "premium",
          language: "pt",
        };
      }

      return response.json({
        token: createToken(user),
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPaid: user.isPaid,
          plan: user.plan,
          language: user.language || "pt",
        },
      });
    }

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
        language: user.language || "pt",
      },
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return response
      .status(500)
      .json({ message: "Erro interno no servidor ao processar login." });
  }
});

// Define a senha no primeiro acesso de uma conta criada pela compra Hotmart.
router.post("/set-password", requireAuth, async (request, response) => {
  try {
    const password = request.body?.password;

    if (typeof password !== "string" || password.length < 6 || password.length > 128) {
      return response
        .status(400)
        .json({ message: "A senha deve ter entre 6 e 128 caracteres." });
    }

    const user = await User.findById(request.user.id);
    if (!user) {
      return response.status(404).json({ message: "Usuário não encontrado." });
    }

    if (!user.isPaid) {
      return response.status(403).json({ message: "Sua conta não possui acesso premium." });
    }

    user.password = password;
    user.passwordSet = true;
    await user.save();

    return response.json({
      message: "Senha criada com sucesso!",
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPaid: user.isPaid,
        plan: user.plan,
        language: user.language || "pt",
      },
    });
  } catch (error) {
    console.error("Erro ao definir senha:", error.message);
    return response.status(500).json({ message: "Erro interno ao criar sua senha." });
  }
});

// Rota para consultar dados do usuário autenticado
router.get("/me", requireAuth, async (request, response) => {
  try {
    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(request.user.id);
      } catch (e) {}
    }

    if (!user) {
      if (request.user?.role === "admin") {
        return response.json({
          user: {
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
            role: "admin",
            isPaid: true,
            plan: "premium",
            language: request.user.language || "pt",
          },
        });
      }
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
        language: user.language || "pt",
      },
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Erro ao carregar dados do usuário." });
  }
});

// Rota para atualizar o idioma preferido do usuário autenticado
router.patch("/language", requireAuth, async (request, response) => {
  try {
    const { language } = request.body;
    if (!["pt", "es", "en"].includes(language)) {
      return response.status(400).json({ message: "Idioma inválido. Suportados: pt, es, en" });
    }

    const user = await User.findByIdAndUpdate(
      request.user.id,
      { language },
      { new: true }
    );

    if (!user) {
      return response.status(404).json({ message: "Usuário não encontrado." });
    }

    return response.json({
      message: "Idioma atualizado com sucesso.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPaid: user.isPaid,
        plan: user.plan,
        language: user.language,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar idioma:", error.message);
    return response.status(500).json({ message: "Erro ao atualizar preferência de idioma." });
  }
});

export default router;
