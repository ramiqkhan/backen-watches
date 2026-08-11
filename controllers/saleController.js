import saleService from '../services/saleService.js';

const saleController = {
  createSale: async (req, res) => {
    try {
      const sale = await saleService.createSale(req.body);
      res.status(201).json({ success: true, data: sale });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getActiveSales: async (req, res) => {
    try {
      const sales = await saleService.getActiveSales();
      res.status(200).json({ success: true, count: sales.length, data: sales });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllSales: async (req, res) => {
    try {
      const sales = await saleService.getAllSales();
      res.status(200).json({ success: true, count: sales.length, data: sales });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getSaleById: async (req, res) => {
    try {
      const sale = await saleService.getSaleById(req.params.id);
      res.status(200).json({ success: true, data: sale });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  updateSale: async (req, res) => {
    try {
      const updatedSale = await saleService.updateSale(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedSale });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteSale: async (req, res) => {
    try {
      const result = await saleService.deleteSale(req.params.id);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
};

export default saleController;