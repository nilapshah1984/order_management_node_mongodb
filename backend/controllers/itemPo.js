import slugify from "slugify";
import dotenv from "dotenv";
import ItemPo from "../models/itemPo.js";
import customerPO from "../models/customerPO.js";
import mongoose from "mongoose";

dotenv.config();



export const createItemPo = async (req, res) => {
  try {
    const { item, qty, cost, tax, salesPrice, customerPo } = req.fields;

    console.log("Received request to create ItemPo:", req.fields);

    if (!item || !mongoose.Types.ObjectId.isValid(item)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }
    if (!qty || !qty.trim()) return res.status(400).json({ error: 'Quantity is required' });
    if (!cost || !cost.trim()) return res.status(400).json({ error: 'Cost is required' });
    if (!tax || !tax.trim()) return res.status(400).json({ error: 'Tax is required' });
    if (!salesPrice || !salesPrice.trim()) return res.status(400).json({ error: 'SalesPrice is required' });
    if (!customerPo || !customerPo.trim()) return res.status(400).json({ error: 'CPO is required' });

    const cpo = new ItemPo({ item, qty, cost, tax, salesPrice, customerPo, slug: item.item }); 
    await cpo.save();
    res.status(201).json(cpo);
  } catch (err) {
    console.error('Error creating ItemPo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const listItemPo = async (req, res) => {
  try {
      const { customerPo } = req.query; 
      const filter = customerPo ? { customerPo } : {}; 
      const items = await ItemPo.find(filter) 
          .populate("item")
          .limit(12)
          .sort({ createdAt: -1 });
      res.json(items);
  } catch (err) {
      console.log('Error fetching items:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const removeItemPo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const item = await ItemPo.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'CPO Item deleted successfully', item });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const readItemPo = async (req, res) => {
  try {
    const item = await ItemPo.findOne({ slug: req.params.slug })
      .populate("item");
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.log('Error fetching item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





export const updateItemPo = async (req, res) => {
  try {
    const { qty, cost, tax, salesPrice, customerPo } = req.body; 
    console.log("Request Body:", req.body);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid itempo ID' });
    }

    const updatedItemPo = await ItemPo.findByIdAndUpdate(
      req.params.id,
      { qty, cost, tax, salesPrice, customerPo },
      { new: true }
    );

    if (!updatedItemPo) {
      return res.status(404).json({ error: 'ItemPo not found' });
    }
    console.log(`Item updated successfully with CPO ID: ${updatedItemPo}`);

    res.json(updatedItemPo);
  } catch (err) {
    console.log('Error updating ItemPo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

