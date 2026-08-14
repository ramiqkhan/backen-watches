import watchStrapService from '../services/watchStrapService.js';

const watchStrapController = {
  getWatchStraps: async (req, res) => {
    try {
      const straps = await watchStrapService.getAllWatchStraps(req.query);
      res.status(200).json({ success: true, count: straps.length, data: straps });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getWatchStrapById: async (req, res) => {
    try {
      const strap = await watchStrapService.getWatchStrapById(req.params.id);
      if (!strap) {
        return res.status(404).json({ success: false, message: 'Watch strap not found' });
      }
      res.status(200).json({ success: true, data: strap });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createWatchStrap: async (req, res) => {
    try {
      const strap = await watchStrapService.createWatchStrap(req.body, req.files);
      res.status(201).json({ success: true, data: strap });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateWatchStrap: async (req, res) => {
    try {
      const strap = await watchStrapService.updateWatchStrap(req.params.id, req.body, req.files);
      res.status(200).json({ success: true, data: strap });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteWatchStrap: async (req, res) => {
    try {
      const result = await watchStrapService.deleteWatchStrap(req.params.id);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
};

export default watchStrapController;