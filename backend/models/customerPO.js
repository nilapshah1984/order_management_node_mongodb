import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const customerPO = new mongoose.Schema({
  customern: {
    type: ObjectId,
    ref: "Customer",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  customerpo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active',
  },
  cpoTotal : {
    type: Number,
    default: 0,
  },
  salesItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ItemPo' }],  
},
{ timestamps: true }
);

export default mongoose.model("CustomerPO", customerPO);
