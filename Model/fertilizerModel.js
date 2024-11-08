const mongoose = require('mongoose');
const { Schema } = mongoose;

const fertilizerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  FertilizerType: {
    type: String,
    required: true,
    enum: ['organic', 'inorganic'], 
  },
  pricePerKg: {
    type: Number,
  },
  NitrogenPercentage: {
    type: Number,
  },
  PotassiumPercentage: {
    type: Number,
  },
  PhosphorusPercentage: {
    type: Number,
  },
  images: [
    {
      url: String,
    },
  ],
});

module.exports = mongoose.model('fertilizer', fertilizerSchema);
