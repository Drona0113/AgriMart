import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [String],
    videoUrl: {
      type: String,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Seeds',
        'Fertilizers',
        'Pesticides',
        'Farming Tools',
        'Fruits & Vegetables',
        'Grains & Pulses',
        'Organic Produce',
        'Livestock & Poultry',
        'Animal Feed',
        'Farm Machinery',
        'Saplings & Nursery'
      ],
    },
    description: {
      type: String,
      required: true,
    },
    usageInstructions: {
      type: String,
    },
    expertTips: [String],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    supplier: {
      name: String,
      contact: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
