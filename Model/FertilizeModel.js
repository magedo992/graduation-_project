const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  fertilizerType: {
    type: String,
    required: true,
  },
  
  pricePerKg: {
    type: Number,
  },
  
  nitrogenPercentage: {
    type: Number,
  },
  
  potassiumPercentage: {
    type: Number,
  },
  
  phosphorusPercentage: {
    type: Number,
  },
  
  images: [
    {
      url: String,
    }
  ],
});

module.exports = mongoose.model('Fertilizer', fertilizerSchema);