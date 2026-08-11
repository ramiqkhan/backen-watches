import WatchStrap from '../models/WatchStrap.js';

const watchStrapService = {
  createStrap: async (data) => {
    const newStrap = new WatchStrap(data);
    return await newStrap.save();
  },

  getAllStraps: async () => {
    return await WatchStrap.find({});
  },

  getStrapById: async (id) => {
    const strap = await WatchStrap.findById(id);
    if (!strap) throw new Error('Watch strap not found');
    return strap;
  },

  getStripsByType: async (strapType) => {
    return await WatchStrap.find({ strapType });
  },

  updateStrap: async (id, updateData) => {
    const strap = await WatchStrap.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!strap) throw new Error('Watch strap not found');
    return strap;
  },

  deleteStrap: async (id) => {
    const strap = await WatchStrap.findByIdAndDelete(id);
    if (!strap) throw new Error('Watch strap not found');
    return { message: 'Watch strap deleted successfully' };
  }
};

export default watchStrapService;