import express from 'express';
import ExpressFormidable from 'express-formidable';
import { createItemPrice, listItemPrice, readItemPrice, removeItemPrice, updateItemPrice } from '../controllers/itemPrice.js';

const router = express.Router();

router.post('/itemprice', ExpressFormidable(), createItemPrice);
router.get('/itemprices', listItemPrice);
router.get('/itemprices/:id', readItemPrice); // Update this line in ItemPrice.js

router.put('/itemprices/:id',ExpressFormidable(),updateItemPrice);
router.delete('/itemprices/:id', removeItemPrice);

export default router;