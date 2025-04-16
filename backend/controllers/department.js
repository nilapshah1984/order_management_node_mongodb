import slugify from "slugify";
import Department from "../models/department.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, email, phone } = req.fields;
    console.log(req.body); 
    console.log(req.fields); 


    if (!name || !name.trim())
      return res.status(400).json({ error: "Name is required" });
    if (!email || !email.trim())
      return res.status(400).json({ error: "Email is required" });
    if (!phone || !phone.trim())
      return res.status(400).json({ error: "Phone number is required" });


    const department = new Department({ ...req.fields, slug: slugify(name) });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    console.error("Error creating department:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listDepartment = async (req, res) => {
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

    const totalDepartments = await Department.countDocuments(searchQuery);
    const departments = await Department.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      departments,
      totalPages: Math.ceil(totalDepartments / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const readDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({ slug: req.params.slug });
    if (!department)
      return res.status(404).json({ error: "Supplier not found" });
    res.status(200).json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { name, email, phone } = req.fields;

    if (!name || !name.trim())
      return res.status(400).json({ error: "Name is required" });
    if (!email || !email.trim())
      return res.status(400).json({ error: "Email is required" });
    if (!phone || !phone.trim())
      return res.status(400).json({ error: "Area is required" });

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name, { lower: true }) },
      { new: true }
    );
    if (!department)
      return res.status(404).json({ error: "supplier not found" });
    res.status(200).json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id); 
    if (!department)
      return res.status(404).json({ error: "supplier not found" });
    res.status(200).json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
