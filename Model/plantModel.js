const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
    enum: ['رملي', 'طيني', 'طمي', 'خصب'], // القيم باللغة العربية
  },
  lightRequirements: {
    type: String,
    required: true,
    enum: ['شمس كاملة', 'ظل جزئي', 'ظل'], // القيم باللغة العربية
  },
  waterRequirements: {
    type: String,
    required: true,
    enum: ['عالية', 'متوسطة', 'منخفضة'], // القيم باللغة العربية
  },
  temperatureRange: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  growthDuration: {
    type: Number,
    required: true,
  },
  spacing: {
    type: String,
  },
  humidityRequirements: {
    type: String,
    enum: ['عالية', 'متوسطة', 'منخفضة'], // القيم باللغة العربية
  },
  purpose: {
    type: String,
    enum: ['زينة', 'طعام', 'طبي'], // القيم باللغة العربية
  },
  plantingMethod: {
    type: String,
    enum: ['بذور', 'قصاصات', 'شتلات'], // القيم باللغة العربية
  },
  specialRequirements: {
    type: String,
  },
  commonDiseases: [String],
  Fertilizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fertilizer'
  }],
  Chemicals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chemical'
  }],
  images: [{
    url: String,
  }],
  imagesPublicIds: [{
    url: String,
    _id: false
  }],
  description: {
    type: String,
    required: false, // You can set this to true if you want it to be required
  }
});

module.exports = mongoose.model('Plant', plantSchema);