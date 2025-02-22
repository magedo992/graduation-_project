const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  nameArabic: { type: String, required: true },
  nameEnglish: { type: String, required: true },
  symptoms: [{ type: String }],
  treatment: { type: String },
  prevention: { type: String }
});

const animalSchema = new mongoose.Schema({
  scientificName: { type: String, required: true },
  commonName: { type: String, required: true },
  image: { type: String }, // URL of the image
  description: { type: String, required: true },
  
  nutrition: {
    dietType: { type: String, enum: ['Herbivore', 'Carnivore', 'Omnivore'], required: true },
    suitableFeeds: [{ type: String }],
    dailyFoodIntake: { type: String },
    dailyWaterNeeds: { type: String },
    forbiddenFoods: [{ type: String }]
  },
  
  lifeCycle: {
    averageLifespan: { type: String },
    sexualMaturityAge: { type: String },
    gestationPeriod: { type: String },
    offspringPerBirth: { type: String }
  },
  
  health: {
    commonDiseases: [diseaseSchema]
  },
  
  care: {
    livingConditions: {
      temperature: { type: String },
      humidity: { type: String },
      shelterType: { type: String }
    },
    vaccinationSchedule: [{ type: String }],
    hygieneCare: { type: String },
    emergencyHandling: { type: String }
  },
  
  production: {
    benefits: [{ type: String }],
    optimizationMethods: [{ type: String }]
  },
  
  behavior: {
    nature: { type: String },
    handlingGuidelines: { type: String },
    comfortSigns: [{ type: String }],
    stressSigns: [{ type: String }]
  },
  
  additionalInfo: {
    expertTips: { type: String },
    interestingFacts: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
