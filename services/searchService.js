import Watch from '../models/Watch.js';

const searchService = {
  searchWatches: async (queryParams) => {
    const { keyword, brand, gender, category, minPrice, maxPrice, isBestSeller } = queryParams;
    let query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (brand) query.brand = brand;
    if (gender) query.gender = gender;
    if (category) query.category = category;
    if (isBestSeller) query.isBestSeller = isBestSeller === 'true';

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    return await Watch.find(query);
  }
};

export default searchService;