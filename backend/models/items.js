import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      trim: true,
    },
    supplier: {
      type: ObjectId, // Reference to Supplier model
      ref: 'Supplier',
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    stock: 
      { 
        type: Number, 
        default: 0 
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);
