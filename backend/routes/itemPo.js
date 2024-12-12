import express from 'express';
import ItemPo from '../models/itemPo.js';
import ExpressFormidable from 'express-formidable';
import { createItemPo, listItemPo,removeItemPo } from '../controllers/itemPo.js';

const router = express.Router();

router.post('/itempo', ExpressFormidable(), createItemPo);
router.get('/itempos', listItemPo);
router.delete('/itempos/:id', removeItemPo);

export default router;