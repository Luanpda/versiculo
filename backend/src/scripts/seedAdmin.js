import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

async function run() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ Defina a variável MONGODB_URI no seu .env para executar o seed.");
    process.exit(1);
  }

  console.log("Conectando ao MongoDB...");
  await mongoose.connect(mongoUri);

  const email = (process.env.ADMIN_EMAIL || "admin@admin.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Administrador";

  let admin = await User.findOne({ email });
  if (admin) {
    admin.name = name;
    admin.password = password;
    admin.role = "admin";
    admin.isPaid = true;
    admin.plan = "premium";
    admin.language = "pt";
    await admin.save();
    console.log(`✅ Administrador existente atualizado com sucesso: ${email} / ${password}`);
  } else {
    admin = new User({
      name,
      email,
      password,
      role: "admin",
      isPaid: true,
      plan: "premium",
      language: "pt",
    });
    await admin.save();
    console.log(`✅ Novo administrador criado com sucesso: ${email} / ${password}`);
  }

  await mongoose.disconnect();
  console.log("Desconectado do MongoDB. Concluído!");
}

run().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
