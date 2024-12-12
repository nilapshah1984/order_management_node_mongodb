const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier'); 

router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find(); 
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers' });
  }
});

module.exports = router;
