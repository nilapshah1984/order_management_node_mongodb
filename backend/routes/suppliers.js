import express from 'express';
import { createSupplier, listSupplier, listAllSuppliers, readSupplier, removeSupplier, updateSupplier } from '../controllers/suppliers.js';
import ExpressFormidable from 'express-formidable';

const router = express.Router();

// Use formidable middleware for parsing form data
router.post('/supplier', ExpressFormidable(), createSupplier);
router.get('/suppliers', listSupplier);
router.get("/suppliers/all", listAllSuppliers);
router.get('/suppliers/:slug', readSupplier);
router.put('/suppliers/:id', ExpressFormidable(), updateSupplier);
router.delete('/suppliers/:id', removeSupplier);

export default router;
