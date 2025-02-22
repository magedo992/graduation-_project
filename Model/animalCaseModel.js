const mongoose = require('mongoose');

const animalCaseSchema = new mongoose.Schema({
    animalType: {
        type: String,
        enum: ['حمار', 'بقر', 'جاموس', 'أغنام', 'ماعز', 'حصان', 'دواجن', 'أرانب'], 
        required: true
    },
    originDetermination: {
        insectRelatedIssues: [String],  
        bacterialIssues: [String],      
        viralIssues: [String],          
        infectionsAndParasites: [String], 
        newIssues: [String],            
        respiratoryIssues: [String],    
        traumasAndInheritance: [String], 
        notDetermined: [String]         
    },
    diagnosticQuestions: {
        naturalBehavior: String, 
        drinksWater: String,
        movesNormally: String,
        breathingNormally: String, 
        regularExcretion: String,
        hairLossOrSkinIssues: String,
        previousSimilarSymptoms: String,
        vaccinationsUpToDate: String,
        recentBehaviorChange: String
    },
    contactInformation: {
        responsiblePersonName: String, 
        responsiblePersonPhone: String, 
        caseAddress: String, 
        caseLocation: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true }
        } 
    },
    images: [{
        url: String, 
        publicId: String 
    }],
    notes: {
        type: String,
        default: ''
    }
});

const AnimalCase = mongoose.model('AnimalCase', animalCaseSchema);

module.exports = AnimalCase;