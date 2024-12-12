import slugify from "slugify";
import Itemprice from "../models/itemPrice.js";
import dotenv from "dotenv";
import ItemPPo from "../models/itemPPO.js";

dotenv.config();


export const createItemPPo = async (req, res) => {
  try {
    const { item, altqty, unitCost, purchasePrice, invoiceNo, invoiceDate, purchaseOrderId } = req.fields;

    // Validation
    if (!item) return res.status(400).json({ error: "Item is required" });
    if (!altqty) return res.status(400).json({ error: "Quantity is required" });
    if (!unitCost) return res.status(400).json({ error: "Cost is required" });
    if (!purchasePrice) return res.status(400).json({ error: "Purchase price is required" });
    if (!invoiceNo) return res.status(400).json({ error: "Invoice number is required" });
    if (!invoiceDate) return res.status(400).json({ error: "Invoice date is required" });
    if (!purchaseOrderId) return res.status(400).json({ error: "Purchase Order ID is required" });

    const itemPpo = new ItemPPo({ ...req.fields, purchaseOrderId }); // Link the item to the Purchase Order
    await itemPpo.save();
    res.status(201).json(itemPpo);
  } catch (err) {
    console.error("Error creating ItemPPo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





export const listItemPPo = async (req, res) => {
  try {
    const { purchaseOrderId } = req.query; 
    const query = purchaseOrderId ? { purchaseOrderId } : {};

    const items = await ItemPPo.find(query)
      .populate("item")
      .limit(12)
      .sort({ createdAt: -1 });
    
    console.log("Populated Items:", items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const readItemPPo = async (req, res) => {
  try {
    const item = await ItemPPo.findOne({ slug: req.params.slug }).populate(
      "Item"
    );
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.log("Error fetching item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeItemPPo = async (req, res) => {
  try {
    const deletedItem = await ItemPPo.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully", item: deletedItem });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateItemPPo = async (req, res) => {
  try {
    const { item, altqty, unitCost, purchasePrice, invoiceNo, invoiceDate } =
      req.fields;

    // Validation
    if (!item) return res.status(400).json({ error: "Item is required" });
    if (!altqty) return res.status(400).json({ error: "Quantity is required" });
    if (!unitCost)
      return res.status(400).json({ error: "Unit Cost is required" });
    if (!purchasePrice)
      return res.status(400).json({ error: "Purchase Price is required" });
    if (!invoiceNo)
      return res.status(400).json({ error: "Invoice Number is required" });
    if (!invoiceDate)
      return res.status(400).json({ error: "Invoice Date is required" });

    const updatedItemPpo = await ItemPPo.findByIdAndUpdate(
      req.params.id,
      req.fields,
      { new: true }
    );

    if (!updatedItemPpo) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updatedItemPpo);
  } catch (err) {
    console.error("Error updating ItemPPo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

















