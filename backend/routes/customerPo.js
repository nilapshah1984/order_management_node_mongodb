import express from 'express';
import ExpressFormidable from 'express-formidable';
import { createCustomerPo, listCustomerPo, readCustomerPo, removeCustomerPo, updateCustomerPo,allCustomerPo, createCustomerTotal } from '../controllers/customerPo.js';

const router = express.Router();

router.post('/customerpo', ExpressFormidable(), createCustomerPo);
router.get('/customerpos', listCustomerPo);
router.get('/allCustomerPos',allCustomerPo);
router.get('/customerpos/:slug', readCustomerPo);
router.put('/customerpos/:id', ExpressFormidable(), updateCustomerPo);
router.delete('/customerpos/:id', removeCustomerPo);
router.post('/customertotal', ExpressFormidable(), createCustomerTotal);

export default router;
    