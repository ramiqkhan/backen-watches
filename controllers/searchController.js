import searchService from '../services/searchService.js';

const searchController = {
  searchWatches: async (req, res) => {
    try {
      const watches = await searchService.searchWatches(req.query);
      res.status(200).json({ 
        success: true, 
        count: watches.length, 
        data: watches 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default searchController;