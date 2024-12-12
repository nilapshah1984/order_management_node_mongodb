import dotenv from "dotenv";
import PurchaseOrder from "../models/purchaseOrder.js"


dotenv.config();

export const createPurchase = async (req, res) => {
  try {    
      
      const { customer, customerpo,date,purchase, status, totalPurchase } = req.fields;
      console.log(req.fields);
      
      // Validation
      if (!customer || !customer.trim()) return res.status(400).json({ error: 'Customer is required' });
      if (!customerpo || !customerpo.trim()) return res.status(400).json({ error: 'CustomerPO is required' });
      if (!purchase || !purchase.trim()) return res.status(400).json({ error: 'CustomerPO is required' });
      if (!status || !status.trim()) return res.status(400).json({ error: 'Status is required' });
      if (!date || !date.trim()) return res.status(400).json({ error: 'Date is required' });

    // Create new item
    const po = new PurchaseOrder({ ...req.fields});
    await po.save();
    res.status(201).json(po);
  } catch (err) {
    console.log('Error creating createCustomerPo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const createPurchaseTotal = async (req, res) => {
  try {
    console.log("Received Payload in Backend:", req.fields);
    let { totalPurchase,purchase } = req.fields;

    if (isNaN(totalPurchase) || totalPurchase === undefined || totalPurchase === null) {
      totalPurchase = 0;
    } else {
      totalPurchase = Number(totalPurchase); 
    }

    const updatedPurchase = await PurchaseOrder.findOneAndUpdate(
      {purchase : purchase},
      { $set: { totalPurchase } },
      { new: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({ error: "PurchaseOrder not found" });
    }

    res.status(200).json(updatedPurchase);
  } catch (err) {
    console.error('Error in createPurchaseTotal:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





export const listPurchase = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortField = "createdAt", sortOrder = "desc" } = req.query; 
    const skip = (page - 1) * limit;

    const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

    const items = await PurchaseOrder.find({})
      .populate("customer")
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions);

    const totalItems = await PurchaseOrder.countDocuments();
    res.json({ items, totalItems });
  } catch (err) {
    console.log('Error fetching items:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const readPurchase = async (req, res) => {
  try {
    const item = await PurchaseOrder.findOne({ slug: req.params.slug })
      .populate("customer");
      console.log("item",item)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
   
  } catch (err) {
    console.log('Error fetching item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removePurchase = async (req, res) => {
  try {
    const item = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'CPO deleted successfully', item });
  } catch (err) {
    console.log('Error deleting item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const { customer, customerpo,date, status,purchase} = req.fields;

    // Validation
    if (!customer || !customer.trim()) return res.status(400).json({ error: 'Customer is required' });
    if (!customerpo || !customerpo.trim()) return res.status(400).json({ error: 'CustomerPO is required' });
    if (!purchase || !purchase.trim()) return res.status(400).json({ error: 'CustomerPO is required' });
    if (!status || !status.trim()) return res.status(400).json({ error: 'Status is required' });
    if (!date || !date.trim()) return res.status(400).json({ error: 'Date is required' });

    // Update item
    const updatedCPO = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,      
      },
      { new: true }
    );
    if (!updatedCPO) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedCPO);
  } catch (err) {
    console.log('Error updating CustomerPO:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

