const express = require('express');
const router = express.Router();
const Item = require('../models/Item');       
const Supplier = require('../models/Supplier'); 

router.post('/items', async (req, res) => {
  const { name, price, supplier } = req.body;

  try {
    const existingSupplier = await Supplier.findById(supplier);
    if (!existingSupplier) {
      return res.status(404).json({ message: 'Supplier Not found' });
    }


    const newItem = new Item({
      name,
      price,
      supplier: existingSupplier._id,
    });

    await newItem.save(); 
    res.status(201).json({ message: 'Item added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item' });
  }
});

module.exports = router;
