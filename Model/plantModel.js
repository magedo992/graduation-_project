const mongoose= require('mongoose');
const plantSchema = new mongoose.Schema({
    name: {
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
    waterRequirements: {
      type: String, 
      required: true,
      enum: ['High', 'Medium', 'Low']
    },
    commonDiseases: [String],
    recommendedFertilizers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'fertilizer'
    }],
    recommendedChemicals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chemical'
    }],
    images: [{
      url: String,
    }], imagesPublicIds:[
      {
        url:String,
        _id: false
      }
    ]
  });

module.exports=mongoose.model('plant',plantSchema);