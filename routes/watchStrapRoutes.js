import express from 'express';
import multer from 'multer';
import watchStrapController from '../controllers/watchStrapController.js';

const router = express.Router();

// Multer setup for handling multipart form data (images) in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Standalone route definitions
router.get('/', watchStrapController.getWatchStraps);
router.post('/', upload.array('images', 5), watchStrapController.createWatchStrap);

router.get('/:id', watchStrapController.getWatchStrapById);
router.put('/:id', upload.array('images', 5), watchStrapController.updateWatchStrap);
router.delete('/:id', watchStrapController.deleteWatchStrap);

export default router;