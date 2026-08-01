import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Please add the condition'],
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Pending', 'Swapped'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
