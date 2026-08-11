import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Sale title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Sale description is required']
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [0, 'Discount cannot be less than 0'],
    max: [100, 'Discount cannot exceed 100']
  },
  watches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Watch'
    }
  ],
  applicableBrand: {
    type: String,
    enum: [
      'All', 'Just Cavalli', 'Tory Burch', 'Tag Heuer', 'Versace', 'Movado', 
      'Tissot', 'Salvatore Ferragamo', 'Gucci', 'Maurice Lacroix', 'Burberry', 
      'Emporio Armani', 'Guess', 'Hugo Boss', 'Michael Kors', 'Tommy Hilfiger', 
      'Fossil', 'Armani Exchange', 'Daniel Wellington'
    ],
    default: 'All'
  },
  startDate: {
    type: Date,
    required: [true, 'Sale start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Sale end date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;