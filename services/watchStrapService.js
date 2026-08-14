import WatchStrap from '../models/WatchStrap.js';
import { cloudinary } from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper: Upload buffer to Cloudinary
const uploadStreamToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: 'watch-straps' },
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

const watchStrapService = {
  // Fetch watch straps with query filters
  getAllWatchStraps: async (queryParams) => {
    const { strapType, isBestSeller } = queryParams;
    let filter = {};

    if (strapType) filter.strapType = strapType;
    if (isBestSeller) filter.isBestSeller = isBestSeller === 'true';

    return await WatchStrap.find(filter);
  },

  // Fetch single watch strap by ID
  getWatchStrapById: async (id) => {
    return await WatchStrap.findById(id);
  },

  // Create watch strap with image handling
  createWatchStrap: async (strapData, files) => {
    let uploadedImages = [];
    if (files && files.length > 0) {
      for (let file of files) {
        const result = await uploadStreamToCloudinary(file.buffer);
        uploadedImages.push(result);
      }
    }

    let parsedSpecs = strapData.specifications;
    if (typeof parsedSpecs === 'string') {
      try {
        parsedSpecs = JSON.parse(parsedSpecs);
      } catch (e) {
        parsedSpecs = {};
      }
    }

    const newWatchStrap = new WatchStrap({
      ...strapData,
      price: Number(strapData.price),
      stock: strapData.stock ? Number(strapData.stock) : 10,
      specifications: parsedSpecs,
      isBestSeller: strapData.isBestSeller === 'true' || strapData.isBestSeller === true,
      images: uploadedImages
    });

    return await newWatchStrap.save();
  },

  // Update watch strap details and optionally add new images
  updateWatchStrap: async (id, strapData, files) => {
    const strap = await WatchStrap.findById(id);
    if (!strap) throw new Error('Watch strap not found');

    let updatedImages = strap.images;
    if (files && files.length > 0) {
      for (let file of files) {
        const result = await uploadStreamToCloudinary(file.buffer);
        updatedImages.push(result);
      }
    }

    let parsedSpecs = strapData.specifications;
    if (typeof parsedSpecs === 'string') {
      try {
        parsedSpecs = JSON.parse(parsedSpecs);
      } catch (e) {}
    }

    const updatePayload = { 
      ...strapData, 
      ...(strapData.price && { price: Number(strapData.price) }),
      ...(strapData.stock && { stock: Number(strapData.stock) }),
      ...(parsedSpecs && { specifications: parsedSpecs }),
      ...(strapData.isBestSeller !== undefined && { 
        isBestSeller: strapData.isBestSeller === 'true' || strapData.isBestSeller === true 
      }),
      images: updatedImages 
    };
    
    // Updated option: replacing deprecated `new: true` with `returnDocument: 'after'`
    return await WatchStrap.findByIdAndUpdate(id, updatePayload, { returnDocument: 'after', runValidators: true });
  },

  // Delete watch strap and its Cloudinary assets
  deleteWatchStrap: async (id) => {
    const strap = await WatchStrap.findById(id);
    if (!strap) throw new Error('Watch strap not found');

    if (strap.images && strap.images.length > 0) {
      for (let img of strap.images) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error('Cloudinary deletion failed:', err);
        }
      }
    }

    await strap.deleteOne();
    return { message: 'Watch strap successfully deleted' };
  }
};

export default watchStrapService;