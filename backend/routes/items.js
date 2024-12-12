import express from 'express';
import ExpressFormidable from 'express-formidable';
import { createItem, listItem, readItem, removeItem, updateItem, updateOneItem} from '../controllers/items.js';

const router = express.Router();


router.post('/item', ExpressFormidable(), createItem);
router.get('/items', listItem);
router.get('/items/:id', readItem);
router.put('/items/:id',ExpressFormidable(),updateItem);
router.delete('/items/:id', removeItem);
router.post('/updateStock',ExpressFormidable(),updateOneItem);
// router.put('/items/update-stock', updateStock); 

export default router;