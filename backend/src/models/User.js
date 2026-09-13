import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Informe um e-mail válido"],
    },
    password: {
      type: String,
      required: [true, "A senha é obrigatória"],
      minlength: [6, "A senha deve ter pelo menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    language: {
      type: String,
      enum: ["pt", "es", "en"],
      default: "pt",
    },
  },
  {
    timestamps: true,
  }
);

// Hash da senha antes de salvar no MongoDB (suporte nativo async no Mongoose 8)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar a senha no login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove a senha do objeto ao converter para JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
