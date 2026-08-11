import express from 'express';
import multer from 'multer';
import { 
  createStrap, 
  getAllStraps, 
  getStrapsByType, 
  updateStrap, 
  deleteStrap 
} from '../controllers/watchStrapController.js'; // <-- Make sure '.js' is here

const router = express.Router();

// Multer setup for handling multipart form data (images) in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route definitions with Multer image upload middleware included
router.route('/')
  .get(getAllStraps)
  .post(upload.array('images', 5), createStrap);

router.get('/style/:strapType', getStrapsByType);

router.route('/:id')
  .put(upload.array('images', 5), updateStrap)
  .delete(deleteStrap);

export default router;