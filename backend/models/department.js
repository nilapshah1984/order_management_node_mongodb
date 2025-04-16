import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
