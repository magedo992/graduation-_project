const mongoose = require('mongoose');

const chemicalsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  chemicalsType: { 
    type: String,
    required: true,
  },
  
  activeIngredient: {      
    name: String,
    concentration: Number,
  },
  
  safetyPeriod: {
    type: Number,
  },
  
  pricePerKg: { 
    type: Number,
  },
  
  images: [
    {
      url: String,
    }
  ],
});

module.exports = mongoose.model('Chemical', chemicalsSchema);