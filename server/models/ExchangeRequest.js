import mongoose from 'mongoose';

const exchangeRequestSchema = new mongoose.Schema(
  {
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a brief message for the exchange'],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);

export default ExchangeRequest;
