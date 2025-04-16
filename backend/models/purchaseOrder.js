import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const purchaseOrders = new mongoose.Schema({
customer:{
    type: ObjectId,
    ref: "Customer",
    trim: true,
    required: true,
  },
  customerpo:{
      type: String,
      ref: "Customer",
      trim: true,
      required: true,
    },
  date: {
      type:Date,
      required:true,
      trim:true,
  },
  purchase: {
      type:String,
      required:true,
  },
  status:{
      type: String,
      enum: ['Active', 'Inactive','draft'],
      default: 'Active',
  },
  totalPurchase: {
    type: Number, 
    default: 0 
  }
});

export default mongoose.model("PurchaseOrder", purchaseOrders);
