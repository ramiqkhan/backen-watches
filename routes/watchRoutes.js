import express from 'express';
import multer from 'multer';
import watchController from '../controllers/watchController.js';

const router = express.Router();

// Multer setup for handling multipart form data (images) in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Standalone route definitions
router.get('/', watchController.getWatches);
router.post('/', upload.array('images', 5), watchController.createWatch);

router.get('/:id', watchController.getWatchById);
router.put('/:id', upload.array('images', 5), watchController.updateWatch);
router.delete('/:id', watchController.deleteWatch);

export default router;