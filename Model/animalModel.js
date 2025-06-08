const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  dietType: String,
  suitableFeeds: [String],
  dailyFoodIntake: [String],
  dailyWaterNeeds: [String],
  forbiddenFoods: [String]
});

const healthSchema = new mongoose.Schema({
  nameArabic: [String],
  symptoms: String,
  treatment: String,
  prevention: String
});

const careSchema = new mongoose.Schema({
  environment: [{ type: String }],
  hygiene: { type: String },
  emergencyCases: { type: String },
  vaccinationSchedule: [
    {
      vaccine: { type: String },
      firstDoseAge: { type: String },
      repetition: { type: String }
    }
  ]
});

const behaviorSchema = new mongoose.Schema({
  nature: { type: String },
  handlingGuidelines: { type: String },
  comfortSigns: [String], 
  stressSigns: [String]   
});

const productionSchema = new mongoose.Schema({
  benefits: [String],
  optimizationMethods: [String]
});

const additionalInfoSchema = new mongoose.Schema({
  expertTips: { type: String },
  interestingFacts: [String]
});

const animalSchema = new mongoose.Schema({
  scientificName: { type: String, required: true },
  commonName: { type: String, required: true },
  image: [{ type: String, required: true }],
  waterNeeds: { type: String },     
  foodNeeds: { type: String },       
  age: { type: String },             
  description: { type: String, required: true },
  nutrition: nutritionSchema,
  lifeCycle: {
    averageLifespan: String,
    sexualMaturityAge: String,
    gestationPeriod: String,
    offspringPerBirth: [String],
  },
  health: healthSchema,
  care: careSchema,
  behavior: behaviorSchema,
  production: productionSchema,
  additionalInfo: additionalInfoSchema, 
  animalType: {
    type: String,
    enum: ["دواجن", "ماشية", "حيوانات المزارع الصغيرة", "حيوانات النقل"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
