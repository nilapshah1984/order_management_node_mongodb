import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    plainPassword: { type: String, required: true },//not secure
    password: { type: String, required: true, min: 6, max: 64 },
    address: { type: String, trim: true },
    role: { type: Number, default: 0 },
    otp: { type: String },          
    otpExpiry: { type: Date },      
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
