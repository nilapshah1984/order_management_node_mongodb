import slugify from "slugify";
import Itemprice from "../models/itemPrice.js";
import dotenv from "dotenv";
import CustomerPO from "../models/customerPO.js";
import Customer from "../models/customers.js";
import ItemPo from "../models/itemPo.js";

dotenv.config();

// export const createCustomerPo = async (req, res) => {
//   try {
//     const { customern, customerpo, date, status } = req.fields;

//     // Validation
//     if (!customern || !customern.trim())
//       return res.status(400).json({ error: "Customer is required" });
//     if (!customerpo || !customerpo.trim())
//       return res.status(400).json({ error: "CustomerPO is required" });
//     if (!status || !status.trim())
//       return res.status(400).json({ error: "Status is required" });
//     if (!date || !date.trim())
//       return res.status(400).json({ error: "Date is required" });

//     const customer = await Customer.findById(customern);
//     if (!customer) return res.status(404).json({ error: "Customer not found" });
//     const cpo = new CustomerPO({
//       ...req.fields,
//       customern: customer._id, //
//       slug: slugify(customerpo),
//     });
//     await cpo.save();
//     res.status(201).json(cpo);
//   } catch (err) {
//     console.log("Error in createCustomerPo:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const createCustomerPo = async (req, res) => {
  try {
    const { customern, customerpo, date, status } = req.fields;

    // Validation
    if (!customern || !customern.trim())
      return res.status(400).json({ error: "Customer zaroori hai" });
    if (!customerpo || !customerpo.trim())
      return res.status(400).json({ error: "CustomerPO zaroori hai" });
    if (!status || !status.trim())
      return res.status(400).json({ error: "Status zaroori hai" });
    if (!date || !date.trim())
      return res.status(400).json({ error: "Date zaroori hai" });

    const customer = await Customer.findById(customern);
    if (!customer) return res.status(404).json({ error: "Customer nahi mila" });

    // Check for existing customerpo
    const existingCpo = await CustomerPO.findOne({ customerpo });
    if (existingCpo) {
      return res.status(400).json({ error: "CustomerPO pehle se maujood hai" });
    }

    const cpo = new CustomerPO({
      ...req.fields,
      customern: customer._id,
      slug: slugify(customerpo),
    });
    await cpo.save();
    res.status(201).json(cpo);
  } catch (err) {
    console.log("Error in createCustomerPo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listCustomerPo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalItems = await CustomerPO.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const items = await CustomerPO.find({})
      .populate("customern")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ customers: items, totalPages });
  } catch (err) {
    console.log("Error fetching items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCustomerTotal = async (req, res) => {
  try {
    const { customerpo, cpoTotal } = req.fields;
    // console.log("Received Payload in Backend", req.fields);
    if (isNaN(cpoTotal) || cpoTotal === undefined || cpoTotal === null) {
      cpoTotal = 0;
    } else {
      cpoTotal = Number(cpoTotal);
    }
    const updatedCustomerPO = cpoTotal.findOneAndUpdate(
      { customerpo: customerpo },
      { $set: { cpoTotal } },
      { new: true }
    );
    if (!updatedCustomerPO) {
      return res.status(404).json({ error: "Customer PO not found" });
    }
    res.status(200).json(updatedCustomerPO);
  } catch (err) {
    console.error("Error in createCustomerTotal:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allCustomerPo = async (req, res) => {
  try {
    const items = await CustomerPO.find({})
      .populate("customern")
      .sort({ createdAt: -1 });
    res.json({ customers: items });
  } catch (err) {
    console.log("Error fetching items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const readCustomerPo = async (req, res) => {
  try {
    const item = await CustomerPO.findOne({ slug: req.params.slug }).populate(
      "customern"
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

export const removeCustomerPo = async (req, res) => {
  try {
    const item = await CustomerPO.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "CPO deleted successfully", item });
  } catch (err) {
    console.log("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const updateCustomerPo = async (req, res) => {
  try {
    const { customern, customerpo, date, status } = req.fields;

    if (!customern || !customern.trim())
      return res.status(400).json({ error: "Customer is required" });
    if (!customerpo || !customerpo.trim())
      return res.status(400).json({ error: "CustomerPO is required" });
    if (!status || !status.trim())
      return res.status(400).json({ error: "Status is required" });
    if (!date || !date.trim())
      return res.status(400).json({ error: "Date is required" });

    const customer = await Customer.findById(customern);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Fetch sales items associated with this Customer PO
    const salesItems = await ItemPo.find({ customerPo: req.params.id });
    const total = salesItems.reduce((sum, item) => {
      const qty = item.qty || 0;
      const cost = item.cost || 0;
      const tax = item.tax || 0;

      const basePrice = qty * cost;
      const taxAmount = (basePrice * tax) / 100;
      const finalPrice = basePrice + taxAmount;
      return sum + finalPrice;
    }, 0);

    const updatedCPO = await CustomerPO.findByIdAndUpdate(
      req.params.id,
      {
        customern: customer._id,
        customerpo,
        date,
        status,
        cpoTotal: total, // Update the CPO total
      },
      { new: true }
    );

    if (!updatedCPO) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedCPO);
  } catch (err) {
    console.log("Error updating CustomerPO:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
