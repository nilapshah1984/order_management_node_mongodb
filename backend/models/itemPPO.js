import mongoose from "mongoose";

const itemPPoSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Item",
      required: true,
    },
    altqty: {
      type: Number,
      required: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    purchaseOrderId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "PurchaseOrder",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ItemPPo", itemPPoSchema);




