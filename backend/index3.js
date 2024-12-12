import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://pmsayal20:rsAqR9Hyf8zfY6UK@ordermanagment.om80u.mongodb.net/order_management?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error =>", err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  
});

const loggingSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  action: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  updatedFields: { type: Object, required: false },
  fullDocument: { type: Object, required: false },
  timestamp: { type: Date, default: Date.now },
  resumeToken: { type: Object, required: false },
});

const Product = mongoose.model("Product", productSchema);
const Logging = mongoose.model("Logging", loggingSchema);

const logAction = async (log) => {
  try {
    await Logging.create(log);
    console.log("Logged action:", log);
  } catch (err) {
    console.error("Error logging action:", err.message);
  }
};

const getResumeToken = async (collectionName) => {
  const log = await Logging.findOne({ collectionName }).sort({ timestamp: -1 });
  return log?.resumeToken || null;
};

const monitorProductChanges = async () => {
  const collectionName = "Product";

  const resumeToken = await getResumeToken(collectionName);

  const changeStream = Product.watch(
    resumeToken ? { resumeAfter: resumeToken } : undefined
  );

  console.log("Change Stream started for Product collection...");

  changeStream.on("change", async (change) => {
    console.log("Change detected:", change);

    const log = {
      collectionName,
      action: change.operationType,
      documentId: change.documentKey?._id,
      fullDocument: change.fullDocument || null,
      updatedFields: change.updateDescription?.updatedFields || null,
      resumeToken: change._id,
    };

    await logAction(log);
  });

  changeStream.on("error", (err) => {
    console.error("Change Stream error:", err);
    console.log("Attempting to restart the Change Stream...");

    setTimeout(() => monitorProductChanges(), 5000);
  });

  changeStream.on("close", () => {
    console.log("Change Stream closed. Restarting...");
    monitorProductChanges();
  });
};

monitorProductChanges();

app.post("/product", async (req, res) => {
  const { name, price, category } = req.body;
  const newProduct = new Product({ name, price, category });

  try {
    const result = await newProduct.save();
    res.status(201).json({
      message: `Product created with _id: ${result._id}`,
      product: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(9000, () => {
  console.log("Node server is running on port 9000");
});
