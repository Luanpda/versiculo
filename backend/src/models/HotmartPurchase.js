import mongoose from "mongoose";

const hotmartPurchaseSchema = new mongoose.Schema(
  {
    transaction: { type: String, required: true, unique: true, index: true },
    event: { type: String, required: true },
    buyerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    buyerName: { type: String, default: "" },
    productId: { type: String, default: "" },
    productName: { type: String, default: "" },
    status: { type: String, default: "" },
    rawEventId: { type: String, default: "" },
    approvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("HotmartPurchase", hotmartPurchaseSchema);
