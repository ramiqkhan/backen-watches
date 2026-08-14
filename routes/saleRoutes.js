import express from 'express';
import saleController from '../controllers/saleController.js';


const router = express.Router();

router.get('/', saleController.getAllSales);
router.get('/active', saleController.getActiveSales); // Keep static paths first
router.post('/', saleController.createSale);

router.get('/:id', saleController.getSaleById); // Dynamic parameters below
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

export default router;

