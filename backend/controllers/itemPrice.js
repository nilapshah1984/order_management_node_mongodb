import slugify from "slugify";
import Itemprice from "../models/itemPrice.js";
import dotenv from "dotenv";

dotenv.config();

export const createItemPrice = async (req, res) => {
  try {    
    console.log(req.fields);
    const {item,price, qty, date} = req.fields;
    console.log(req.fields);
    
    if (!item || !item.trim()) return res.status(400).json({ error: 'Item is required' });
    if (!price || !price.trim()) return res.status(400).json({ error: 'Price is required' });
    if (!qty || !qty.trim()) return res.status(400).json({ error: 'Quantity is required' });
    if (!date || !date.trim()) return res.status(400).json({ error: 'Date is required' });

    const newItemprice = new Itemprice({ ...req.fields});
    await newItemprice.save();
    res.status(201).json(newItemprice);
  } catch (err) {
    console.log('Error creating item price:', err);
    res.status(500).json({  error: 'Internal Server Error' });
  }
};




export const listItemPrice = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;


    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; 

    const items = await Itemprice.find({ item: req.query.item })
      .sort({[sortField]: sortOrder, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Itemprice.countDocuments({ item: req.query.item });
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ items, totalPages, currentPage: page, totalCount });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error while getting item prices");
  }
};



export const readItemPrice = async (req, res) => {
    try {
        const item = await Itemprice.findById(req.params.id); 
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.log('Error fetching item:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const removeItemPrice = async (req, res) => {
  try {
    const item = await Itemprice.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully', item });
  } catch (err) {
    console.log('Error deleting item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const updateItemPrice = async (req, res) => {
  try {
    const { item, price, qty, date } = req.fields;
  console.log(req.fields);
  
    if (!price || !price.trim()) return res.status(400).json({ error: 'Price is required' });
    if (!qty || !qty.trim()) return res.status(400).json({ error: 'Quatity is required' });
    if (!date || !date.trim()) return res.status(400).json({ error: 'Date is required' });

    const updatedItem = await Itemprice.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields
      },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    console.log('Error updating item price:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// import slugify from "slugify";
// import Itemprice from "../models/itemPrice.js";
// import dotenv from "dotenv";

// dotenv.config();

// export const createItemPrice = async (req, res) => {
//   try {    
//     console.log(req.fields);
//     const {itemName, item,price, qty, date} = req.fields;
//     console.log(req.fields);
    
//     if (!itemName || !itemName.trim()) return res.status(400).json({ error: 'Item name is required' });//new Changes
//     if (!item || !item.trim()) return res.status(400).json({ error: 'Item is required' });
//     if (!price || !price.trim()) return res.status(400).json({ error: 'Price is required' });
//     if (!qty || !qty.trim()) return res.status(400).json({ error: 'Quantity is required' });
//     if (!date || !date.trim()) return res.status(400).json({ error: 'Date is required' });

//     const newItemprice = new Itemprice({ ...req.fields});
//     await newItemprice.save();
//     res.status(201).json(newItemprice);
//   } catch (err) {
//     console.log('Error creating item price:', err);
//     res.status(500).json({  error: 'Internal Server Error' });
//   }
// };




// export const listItemPrice = async (req, res) => {
//   try {
//     const itemId = req.query.item;//new Changes
//     const page = parseInt(req.query.page) || 1;
//     const limit = 5;
//     const skip = (page - 1) * limit;

//     const sortField = req.query.sortField || 'createdAt';
//     const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; 

//     const items = await Itemprice.find({ item: itemId })//new Changes
//       .sort({[sortField]: sortOrder, createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const totalCount = await Itemprice.countDocuments({ item: itemId }); //new Changes
//     const totalPages = Math.ceil(totalCount / limit);

//     res.json({ items, totalPages, currentPage: page, totalCount });
//   } catch (err) {
//     console.log(err);
//     res.status(400).send("Error while getting item prices");
//   }
// };



// export const readItemPrice = async (req, res) => {
//     try {
//         const item = await Itemprice.findById(req.params.id); 
//         if (!item) {
//             return res.status(404).json({ error: 'Item not found' });
//         }
//         res.json(item);
//     } catch (err) {
//         console.log('Error fetching item:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



// export const removeItemPrice = async (req, res) => {
//   try {
//     const item = await Itemprice.findByIdAndDelete(req.params.id);
//     if (!item) {
//       return res.status(404).json({ error: 'Item not found' });
//     }
//     res.json({ message: 'Item deleted successfully', item });
//   } catch (err) {
//     console.log('Error deleting item:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



// export const updateItemPrice = async (req, res) => {
//   try {
//     const { itemName, item, price, qty, date } = req.fields;
//     console.log(req.fields);  
//     if (!itemName || !itemName.trim()) return res.status(400).json({ error: 'Item name is required' });//new change
//     if (!price || !price.trim()) return res.status(400).json({ error: 'Price is required' });
//     if (!qty || !qty.trim()) return res.status(400).json({ error: 'Quatity is required' });
//     if (!date || !date.trim()) return res.status(400).json({ error: 'Date is required' });

//     const updatedItem = await Itemprice.findByIdAndUpdate(
//       req.params.id,
//       { ...req.fields },
//       { new: true }
//     );
//     if (!updatedItem) {
//       return res.status(404).json({ error: 'Item not found' });
//     }
//     res.json(updatedItem);
//   } catch (err) {
//     console.log('Error updating item price:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


