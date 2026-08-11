import Watch from '../models/Watch.js';
import { cloudinary } from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper: Upload buffer to Cloudinary
const uploadStreamToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: 'watches' },
      (error, result) => {
        if (result) {
          resolve({ public_id: result.public_id, url: result.secure_url });
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const watchService = {
  // Fetch watches with query filters
  getAllWatches: async (queryParams) => {
    const { brand, gender, category, isBestSeller } = queryParams;
    let filter = {};

    if (brand) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (isBestSeller) filter.isBestSeller = isBestSeller === 'true';

    return await Watch.find(filter);
  },

  // Fetch single watch by ID
  getWatchById: async (id) => {
    return await Watch.findById(id);
  },

  // Create watch with image handling
  createWatch: async (watchData, files) => {
    let uploadedImages = [];
    if (files && files.length > 0) {
      for (let file of files) {
        const result = await uploadStreamToCloudinary(file.buffer);
        uploadedImages.push(result);
      }
    }

    // Parse specifications if sent as a JSON string from form-data
    let parsedSpecs = watchData.specifications;
    if (typeof parsedSpecs === 'string') {
      try {
        parsedSpecs = JSON.parse(parsedSpecs);
      } catch (e) {
        // Fallback or leave as is if parsing fails
      }
    }

    const newWatch = new Watch({
      ...watchData,
      specifications: parsedSpecs,
      isBestSeller: watchData.isBestSeller === 'true' || watchData.isBestSeller === true,
      images: uploadedImages
    });

    return await newWatch.save();
  },

  // Update watch details and optionally add new images
  updateWatch: async (id, watchData, files) => {
    const watch = await Watch.findById(id);
    if (!watch) throw new Error('Watch not found');

    let updatedImages = watch.images;
    if (files && files.length > 0) {
      for (let file of files) {
        const result = await uploadStreamToCloudinary(file.buffer);
        updatedImages.push(result);
      }
    }

    let parsedSpecs = watchData.specifications;
    if (typeof parsedSpecs === 'string') {
      try {
        parsedSpecs = JSON.parse(parsedSpecs);
      } catch (e) {}
    }

    const updatePayload = { 
      ...watchData, 
      ...(parsedSpecs && { specifications: parsedSpecs }),
      images: updatedImages 
    };
    
    return await Watch.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true });
  },

  // Delete watch and its Cloudinary assets
  deleteWatch: async (id) => {
    const watch = await Watch.findById(id);
    if (!watch) throw new Error('Watch not found');

    if (watch.images && watch.images.length > 0) {
      for (let img of watch.images) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error('Cloudinary deletion failed:', err);
        }
      }
    }

    await watch.deleteOne();
    return { message: 'Watch successfully deleted' };
  }
};

export default watchService;