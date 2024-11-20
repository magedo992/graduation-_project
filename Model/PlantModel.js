const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  growthDuration: { // بالأسابيع
    type: Number,
    required: true,
  },
  waterRequirements: {
    type: String, // يمكن أن تكون قيم مثل "مرتفعة"، "متوسطة"، "منخفضة"
    required: true,
  },
  commonDiseases: [
    {
      name: String,
    }
  ],
  recommendedFertilizers: {
    type: String,
  },
  images: [
    {
      url: String,
    }
  ],
});

module.exports = mongoose.model('Plant', plantSchema);