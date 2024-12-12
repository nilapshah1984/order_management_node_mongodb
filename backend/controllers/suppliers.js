import dotenv from "dotenv";
import slugify from 'slugify';
import Supplier from "../models/suppliers.js";

dotenv.config();

export const createSupplier = async (req, res) => {
  try {
    console.log('Request Fields:', req.fields);
    
    const { name, email, phone, area, address, city, status, gstn } = req.fields;

    // Validation
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ error: 'Phone number is required' });
    if (!area || !area.trim()) return res.status(400).json({ error: 'Area is required' });
    if (!address || !address.trim()) return res.status(400).json({ error: 'Address is required' });
    if (!city || !city.trim()) return res.status(400).json({ error: 'City is required' });
    if (!gstn || !gstn.trim()) return res.status(400).json({ error: 'GSTN is required' });
    if (!status || !status.trim()) return res.status(400).json({ error: 'Status is required' });

    // Create new supplier
    const supplier = new Supplier({ ...req.fields, slug: slugify(name) });
    await supplier.save();
    res.status(201).json(supplier); // 201 Created status code
  } catch (err) {
    console.log('Error creating supplier:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const listSupplier = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { phone: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const totalSuppliers = await Supplier.countDocuments(searchQuery); 
    const suppliers = await Supplier.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      suppliers,
      totalPages: Math.ceil(totalSuppliers / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// export const listSupplier = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;  
//     const limit = parseInt(req.query.limit) || 10; 
//     const skip = (page - 1) * limit;

//     const searchQuery = req.query.search
//       ? {
//           $or: [
//             { name: { $regex: req.query.search, $options: "i" } },
//             { email: { $regex: req.query.search, $options: "i" } },
//             { phone: { $regex: req.query.search, $options: "i" } },
//           ],
//         }
//       : {};

//     const totalSuppliers = await Supplier.countDocuments(searchQuery); 
//     const suppliers = await Supplier.find(searchQuery)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json({
//       suppliers,
//       totalPages: Math.ceil(totalSuppliers / limit),
//       currentPage: page,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };


export const listAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.status(200).json(suppliers); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};




export const readSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ slug: req.params.slug });
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.status(200).json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { name, email, phone, area, address, city, status, gstn } = req.fields;

    // Validation
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!area || !area.trim()) return res.status(400).json({ error: 'Area is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ error: 'Number is required' });
    if (!address || !address.trim()) return res.status(400).json({ error: 'Address is required' });
    if (!city || !city.trim()) return res.status(400).json({ error: 'City is required' });
    if (!gstn || !gstn.trim()) return res.status(400).json({ error: 'GSTN is required' });
    if (!status || !status.trim()) return res.status(400).json({ error: 'Status is required' });

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id, // Changed to 'id'
      { ...req.fields, slug: slugify(name, { lower: true }) },
      { new: true }
    );
    if (!supplier) return res.status(404).json({ error: 'supplier not found' });
    res.status(200).json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id); // Changed to 'id'
    if (!supplier) return res.status(404).json({ error: 'supplier not found' });
    res.status(200).json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
