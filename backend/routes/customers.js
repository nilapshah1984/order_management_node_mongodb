import express from 'express';
import { createCustomer, listCustomers, readCustomer, removeCustomer, updateCustomer, verifyexistingrecord } from '../controllers/customers.js';
import ExpressFormidable from 'express-formidable';

const router = express.Router();

router.post('/customer', ExpressFormidable(), createCustomer);
router.get('/customers', listCustomers);
router.get('/customers/:slug', readCustomer);
router.put('/customer/:id',ExpressFormidable(), updateCustomer);
router.delete('/customers/:id', removeCustomer);
router.post('/customers/verify', verifyexistingrecord)

export default router;










