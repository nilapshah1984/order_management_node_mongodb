import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customers.js";
import supplierRoutes from "./routes/suppliers.js";
import itemRoutes from "./routes/items.js";
import itempriceRoutes from "./routes/itemPrice.js"
import customerpoRoutes from "./routes/customerPo.js";
import itempoRoutes from "./routes/itemPo.js";
import purchaseRoutes from "./routes/purchaseOrder.js";
import itemppoRoutes from "./routes/itemPPO.js";

dotenv.config();

const app = express();

// DB connections
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error =>", err));

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router middleware
app.use("/api", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", supplierRoutes);
app.use("/api",itemRoutes);
app.use("/api",itempriceRoutes);
app.use("/api",customerpoRoutes);
app.use("/api",itempoRoutes);
app.use("/api",purchaseRoutes);
app.use("/api",itemppoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
// Define port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Node server is running on port ${port}`);
});


