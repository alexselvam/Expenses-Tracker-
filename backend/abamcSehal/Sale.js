const mongoose = require('mongoose');
const { Schema } = mongoose;
const { collection_prefix } = require("../config/geosbonosdm");

const SaleSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true
    },
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    customerName: {
      type: String,
      default: 'Guest Customer'
    },
    customerType: {
      type: String,
      enum: ['New', 'Returning'],
      default: 'New'
    },
    product: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'Others'
    },
    channel: {
      type: String,
      enum: ['Website', 'Marketplace', 'Mobile App', 'Social Media'],
      default: 'Website'
    },
    region: {
      type: String,
      enum: ['North America', 'Europe', 'Asia', 'South America', 'Africa'],
      default: 'North America'
    },
    amount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// Oru specific user-ku ore orderId thirumba vara koodathu
SaleSchema.index({ userId: 1, orderId: 1 }, { unique: true });
SaleSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Sale', SaleSchema, collection_prefix + 'elas');