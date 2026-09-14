import mongoose from "mongoose";
import User from "../models/User.js";

// Cache de conexão para execução otimizada em Serverless (Vercel) e Node local
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("A variável de ambiente MONGODB_URI não foi definida no .env ou na Vercel.");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise || mongoose.connection.readyState !== 1) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(mongoUri, opts).then(async (mongooseInstance) => {
      console.log("Conectado ao MongoDB com sucesso!");
      await seedAdminUser();
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("Erro ao conectar ao MongoDB:", error.message);
    throw error;
  }
}

async function seedAdminUser() {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminsToSeed = [
    {
      email: (process.env.ADMIN_EMAIL || "admin@admin.com").toLowerCase(),
      name: process.env.ADMIN_NAME || "Administrador",
      password: adminPassword,
    },
    {
      email: "admin@palavradodia.com",
      name: "Administrador Palavra",
      password: adminPassword,
    },
  ];

  for (const item of adminsToSeed) {
    try {
      const existingAdmin = await User.findOne({ email: item.email });
      if (!existingAdmin) {
        const admin = new User({
          name: item.name,
          email: item.email,
          password: item.password,
          role: "admin",
          isPaid: true,
          plan: "premium",
          language: "pt",
        });
        await admin.save();
        console.log(`Usuário Administrador criado com sucesso! (${item.email})`);
      } else {
        existingAdmin.role = "admin";
        existingAdmin.isPaid = true;
        existingAdmin.plan = "premium";
        existingAdmin.password = item.password;
        await existingAdmin.save();
        console.log(`Usuário Administrador sincronizado com sucesso! (${item.email})`);
      }
    } catch (error) {
      console.warn(`Aviso ao verificar usuário admin (${item.email}):`, error.message);
    }
  }
}
