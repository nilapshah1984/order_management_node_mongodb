import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const itemPoSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',  
    required: true
  },
  qty: {
    type: String,
    required: true
  },
  cost: {
    type: String,
    required: true
  },
  tax: {
    type: String,
    required: true
  },
  salesPrice: {
    type: Number,
    required: true
  },
  customerPo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CustomerPO' 
  },
  slug: {
    type: String,
    // unique: true
  }
}, { timestamps: true });

export default mongoose.model('ItemPo', itemPoSchema);
