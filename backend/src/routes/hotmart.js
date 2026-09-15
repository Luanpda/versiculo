import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import HotmartPurchase from "../models/HotmartPurchase.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "versiculo_jwt_secret_key_2026_segura";

function text(value) {
  return value == null ? "" : String(value).trim();
}

function getBuyer(data) {
  return data?.buyer || data?.subscriber || data?.shopper || {};
}

function getPurchase(data) {
  return data?.purchase || data?.transaction || {};
}

function getProduct(data) {
  return data?.product || {};
}

function extractPurchase(body) {
  const data = body?.data || {};
  const buyer = getBuyer(data);
  const purchase = getPurchase(data);
  const product = getProduct(data);

  return {
    event: text(body?.event).toUpperCase(),
    eventId: text(body?.id),
    transaction: text(purchase?.transaction || data?.transaction || data?.transaction_id),
    email: text(buyer?.email || data?.buyer_email).toLowerCase(),
    name: text(buyer?.name || data?.buyer_name || "Cliente"),
    productId: text(product?.id || data?.product_id),
    productName: text(product?.name),
    status: text(purchase?.status || data?.status),
  };
}

function verifyHotmart(request) {
  const received = text(request.headers["x-hotmart-hottok"]);
  const expected = text(process.env.HOTMART_HOTTOK);
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

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
    JWT_SECRET,
    { expiresIn: "10y" }
  );
}

// Hotmart chama esta rota quando o estado da compra muda.
router.post("/webhook", async (request, response) => {
  try {
    if (!verifyHotmart(request)) {
      return response.status(401).json({ message: "Webhook não autorizado." });
    }

    const purchase = extractPurchase(request.body);
    const activeEvents = new Set([
      "PURCHASE_APPROVED",
      "PURCHASE_COMPLETE",
      "PURCHASE_COMPLETED",
      "SUBSCRIPTION_REACTIVATED",
      "PURCHASE_CHARGEBACK_REVERSED",
    ]);
    const inactiveEvents = new Set([
      "PURCHASE_REFUNDED",
      "PURCHASE_CANCELED",
      "PURCHASE_CANCELLED",
      "PURCHASE_CHARGEBACK",
      "PURCHASE_OVERDUE",
      "PURCHASE_EXPIRED",
    ]);

    if (!purchase.email) {
      return response.status(400).json({ message: "Webhook sem e-mail do comprador." });
    }

    const transaction = purchase.transaction || `event:${purchase.eventId || crypto.randomUUID()}`;

    await HotmartPurchase.findOneAndUpdate(
      { transaction },
      {
        transaction,
        event: purchase.event,
        buyerEmail: purchase.email,
        buyerName: purchase.name,
        productId: purchase.productId,
        productName: purchase.productName,
        status: purchase.status,
        rawEventId: purchase.eventId,
        approvedAt: activeEvents.has(purchase.event) ? new Date() : null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (activeEvents.has(purchase.event)) {
      let user = await User.findOne({ email: purchase.email });

      if (!user) {
        // O comprador não precisa escolher senha. Uma senha aleatória é criada apenas
        // para satisfazer o schema atual; ela nunca é mostrada ao comprador.
        user = new User({
          name: purchase.name || "Cliente",
          email: purchase.email,
          password: crypto.randomBytes(32).toString("hex"),
          role: "user",
          isPaid: true,
          plan: "premium",
          language: "pt",
          passwordSet: false,
        });
      } else {
        user.isPaid = true;
        user.plan = "premium";
        if (!user.name && purchase.name) user.name = purchase.name;
      }

      await user.save();
    }

    if (inactiveEvents.has(purchase.event)) {
      await User.findOneAndUpdate(
        { email: purchase.email },
        { $set: { isPaid: false, plan: "free" } }
      );
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error("Erro no webhook Hotmart:", error.message);
    return response.status(500).json({ message: "Erro interno ao processar webhook." });
  }
});

// Cria uma sessão para um comprador que já teve a compra aprovada.
// O uso recomendado é chamar esta rota somente a partir de uma página de pós-compra
// com um identificador de compra fornecido pela Hotmart.
router.post("/access", async (request, response) => {
  try {
    const email = text(request.body?.email).toLowerCase();
    const transaction = text(request.body?.transaction);

    if (!email || !transaction) {
      return response.status(400).json({ message: "E-mail e transação são obrigatórios." });
    }

    const purchase = await HotmartPurchase.findOne({
      transaction,
      buyerEmail: email,
      event: { $in: ["PURCHASE_APPROVED", "PURCHASE_COMPLETE", "PURCHASE_COMPLETED"] },
    });

    if (!purchase) {
      return response.status(403).json({ message: "Compra aprovada não encontrada." });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isPaid) {
      return response.status(403).json({ message: "Acesso ainda não está liberado." });
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
        needsPasswordSetup: user.passwordSet === false,
      },
    });
  } catch (error) {
    console.error("Erro ao criar acesso Hotmart:", error.message);
    return response.status(500).json({ message: "Erro interno ao liberar acesso." });
  }
});

export default router;
