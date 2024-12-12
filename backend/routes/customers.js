import express from 'express';
// import formidable from 'formidable';
import { createCustomer, listCustomers, readCustomer, removeCustomer, updateCustomer } from '../controllers/customers.js';
import ExpressFormidable from 'express-formidable';

const router = express.Router();

// Use formidable middleware for parsing form data
router.post('/customer', ExpressFormidable(), createCustomer);
router.get('/customers', listCustomers);
router.get('/customers/:slug', readCustomer);
router.put('/customers/:id',ExpressFormidable(), updateCustomer);
router.delete('/customers/:id', removeCustomer);

export default router;



