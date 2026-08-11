import Sale from '../models/Sale.js';
import Watch from '../models/Watch.js';

const saleService = {
  createSale: async (saleData) => {
    const { title, description, discountPercentage, watches, applicableBrand, startDate, endDate } = saleData;

    const newSale = new Sale({
      title,
      description,
      discountPercentage,
      watches: watches || [],
      applicableBrand: applicableBrand || 'All',
      startDate,
      endDate
    });

    return await newSale.save();
  },

  getActiveSales: async () => {
    const currentDate = new Date();
    return await Sale.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    }).populate('watches', 'name brand price images');
  },

  getAllSales: async () => {
    // ✅ Added 'images' to the population list so Cloudinary images are included everywhere
    return await Sale.find({}).populate('watches', 'name brand price images');
  },

  getSaleById: async (id) => {
    const sale = await Sale.findById(id).populate('watches', 'name brand price images');
    if (!sale) throw new Error('Sale campaign not found');
    return sale;
  },

  updateSale: async (id, updateData) => {
    const sale = await Sale.findById(id);
    if (!sale) throw new Error('Sale campaign not found');

    return await Sale.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('watches', 'name brand price images');
  },

  deleteSale: async (id) => {
    const sale = await Sale.findById(id);
    if (!sale) throw new Error('Sale campaign not found');

    await sale.deleteOne();
    return { message: 'Sale campaign deleted successfully' };
  }
};

export default saleService;