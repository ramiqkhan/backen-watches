import watchService from '../services/watchService.js';

const watchController = {
  getWatches: async (req, res) => {
    try {
      const watches = await watchService.getAllWatches(req.query);
      res.status(200).json({ success: true, count: watches.length, data: watches });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getWatchById: async (req, res) => {
    try {
      const watch = await watchService.getWatchById(req.params.id);
      if (!watch) {
        return res.status(404).json({ success: false, message: 'Watch not found' });
      }
      res.status(200).json({ success: true, data: watch });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createWatch: async (req, res) => {
    try {
      const watch = await watchService.createWatch(req.body, req.files);
      res.status(201).json({ success: true, data: watch });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateWatch: async (req, res) => {
    try {
      const watch = await watchService.updateWatch(req.params.id, req.body, req.files);
      res.status(200).json({ success: true, data: watch });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteWatch: async (req, res) => {
    try {
      const result = await watchService.deleteWatch(req.params.id);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
};

export default watchController;