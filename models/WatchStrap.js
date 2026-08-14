import mongoose from 'mongoose';

const watchStrapSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  strapType: { 
    type: String, 
    enum: ['Leather Strap', 'Stainless Steel', 'Mesh Strap', 'Rubber Strap'], 
    required: true 
  },
  images: [
    {
      public_id: { type: String },
      url: { type: String }
    }
  ],
  stock: { type: Number, default: 10 },
  isBestSeller: { type: Boolean, default: false },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const WatchStrap = mongoose.model('WatchStrap', watchStrapSchema);
export default WatchStrap;