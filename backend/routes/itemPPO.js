import express from 'express';
import ExpressFormidable from 'express-formidable';
import { createItemPPo, listItemPPo, readItemPPo, removeItemPPo, updateItemPPo } from '../controllers/itemPPO.js';


const router = express.Router();

router.post('/itemppo', ExpressFormidable(), createItemPPo);
router.get('/itemppos', listItemPPo);
router.get('/itemppos/:id', readItemPPo);
router.put('/itemppos/:id',ExpressFormidable(), updateItemPPo);
router.delete('/itemppos/:id', removeItemPPo);

export default router;
