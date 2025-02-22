const { required } = require('joi');
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
   
  },
  lightRequirements: {
    type: String,
    required: true,
    enum: ['عالي', 'متوسط', 'منخفض'], // القيم باللغة العربية
  },
  waterRequirements: {
    type: String,
    required: true,
    enum: ['عالي', 'متوسط', 'منخفض'], // القيم باللغة العربية
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
    type: String,
    required: true,
  },
  spacing: {
    type: String,
  },
  humidityRequirements: {
    type: String,
    enum: ['عالي', 'متوسط', 'منخفض'], // القيم باللغة العربية
  },
  purpose: {
    type: String,
    enum: ['زينة', 'طعام', 'طبي'], 
  },
  plantingMethod: {
    type: String,
  },
  specialRequirements: {
    type: String,
  },
  commonDiseases: [String],
  preventionMethods: { // New attribute for طرق الوقاية
    type: [String], // Array of strings to store multiple prevention methods
    default: [], // Default to an empty array
  },
  Fertilizers: {
    type:String
   
  },
  Chemicals: {
    type: String,
    
  },
  images: [{
    url: String,
  }],
  imagesPublicIds: [{
    url: String,
    _id: false
  }],
  description: {
    type: String,
    required: false, 
  },
  category: {
    type: String,
    enum: ['النباتات الطبية', 'النباتات العطرية', 'النباتات الغذائية', 'النباتات الصناعية', 'الفواكه', 'الخضروات', 'نباتات الزينة', 'النباتات البرية'],
  
  }
});

module.exports = mongoose.model('Plant', plantSchema);