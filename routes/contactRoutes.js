import express from 'express';
import contactController from '../controllers/contactController.js';

const router = express.Router();

router.get('/', contactController.getAllContacts);
router.post('/', contactController.createContact);

router.get('/:id', contactController.getContactById);
router.put('/:id/status', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

export default router;