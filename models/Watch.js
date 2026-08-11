import mongoose from 'mongoose';

const watchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Watch name is required'],
    trim: true
  },
  referenceNo: {
    type: String,
    required: [true, 'Reference number is required'],
    trim: true,
    unique: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    enum: [
      'Just Cavalli', 'Tory Burch', 'Tag Heuer', 'Versace', 'Movado', 
      'Tissot', 'Salvatore Ferragamo', 'Gucci', 'Maurice Lacroix', 'Burberry', 
      'Emporio Armani', 'Guess', 'Hugo Boss', 'Michael Kors', 'Tommy Hilfiger', 
      'Fossil', 'Armani Exchange', 'Daniel Wellington'
    ]
  },
  gender: {
    type: String,
    required: [true, 'Gender category is required'],
    enum: ['Men', 'Women', 'Unisex']
  },
  category: {
    type: String,
    required: [true, 'Style category is required'],
    enum: ['High Horology', 'Sport', 'Classic', 'Vintage']
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 1
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  warranty: {
    type: String,
    required: [true, 'Warranty details are required']
  },
  // Detailed Technical Specs matching your frontend display card
  specifications: {
    dialFinish: { type: String, required: true },
    movement: { type: String, required: true },
    caseMaterial: { type: String, required: true },
    caseDiameter: { type: String, required: true },
    caseThickness: { type: String, required: true },
    strapMaterial: { type: String, required: true },
    waterResistance: { type: String, required: true }
  },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true }
    }
  ]
}, { timestamps: true });

const Watch = mongoose.model('Watch', watchSchema);
export default Watch;