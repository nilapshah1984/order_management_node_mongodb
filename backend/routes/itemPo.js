import express from 'express';
import ItemPo from '../models/itemPo.js';
import ExpressFormidable from 'express-formidable';
import { createItemPo, listItemPo,removeItemPo, updateItemPo } from '../controllers/itemPo.js';

const router = express.Router();

router.post('/itempo', ExpressFormidable(), createItemPo);
router.get('/itempos', listItemPo);
router.put("/itempos/:id", updateItemPo);
router.delete('/itempos/:id', removeItemPo);

export default router;