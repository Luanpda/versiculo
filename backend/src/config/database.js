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

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
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
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@palavradodia.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "senha123";
  const adminName = process.env.ADMIN_NAME || "Administrador";

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        isPaid: true,
        plan: "premium",
      });
      await admin.save();
      console.log(`Usuário Administrador criado com sucesso! (${adminEmail})`);
    }
  } catch (error) {
    console.warn("Aviso ao verificar usuário admin:", error.message);
  }
}
