import mongoose from "mongoose";
import slugify from "slugify";
import Item from "../models/items.js";
import Supplier from "../models/suppliers.js";
import dotenv from "dotenv";

dotenv.config();

export const createItem = async (req, res) => {
  try {
    const {
      item,
      supplier: supplierName,
      description,
      category,
      brand,
      unit,
      status,
      stock,
    } = req.fields;

    if (!item || !item.trim())
      return res.status(400).json({ error: "Item is required" });
    if (!supplierName || !supplierName.trim())
      return res.status(400).json({ error: "Supplier is required" });
    if (!description || !description.trim())
      return res.status(400).json({ error: "Description is required" });
    if (!category || !category.trim())
      return res.status(400).json({ error: "Category is required" });
    if (!brand || !brand.trim())
      return res.status(400).json({ error: "Brand is required" });
    if (!unit || !unit.trim())
      return res.status(400).json({ error: "Unit is required" });
    if (!status || !status.trim())
      return res.status(400).json({ error: "Status is required" });

    const supplier = await Supplier.findOne({ name: supplierName });
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    const newItem = new Item({
      ...req.fields,
      supplier: supplier._id,
      slug: slugify(item),
      stock: stock || 0,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.log("Error creating item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateOneItem = async (req, res) => {
  const { item, stock } = req.fields;
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { item: item },
      { $set: { stock } },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
};

export const updateItem = async (req, res) => {
  try {
    const {
      item,
      supplier: supplierName,
      description,
      category,
      brand,
      unit,
      status,
      stock,
    } = req.fields;

    if (!item || !item.trim())
      return res.status(400).json({ error: "Item is required" });
    if (!supplierName || !supplierName.trim())
      return res.status(400).json({ error: "Supplier is required" });
    if (!description || !description.trim())
      return res.status(400).json({ error: "Description is required" });
    if (!category || !category.trim())
      return res.status(400).json({ error: "Category is required" });
    if (!brand || !brand.trim())
      return res.status(400).json({ error: "Brand is required" });
    if (!unit || !unit.trim())
      return res.status(400).json({ error: "Unit is required" });
    if (!status || !status.trim())
      return res.status(400).json({ error: "Status is required" });

    const supplier = await Supplier.findOne({ name: supplierName });
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        supplier: supplier._id,
        slug: slugify(item),
        stock: stock || 0,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    console.log("Error updating item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listItem = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const items = await Item.find({})
      .populate("supplier")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalItems = await Item.countDocuments();
    res.json({ items, totalItems });
  } catch (err) {
    console.log("Error fetching items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const readItem = async (req, res) => {
  try {
    const item = await Item.findOne({ slug: req.params.slug })
      .populate("Supplier")
      .populate("Itemprice");
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.log("Error fetching item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully", item });
  } catch (err) {
    console.log("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
