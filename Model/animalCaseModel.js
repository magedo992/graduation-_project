const mongoose = require('mongoose');


const animalCaseSchema = new mongoose.Schema({
    animalType: {
        type: String,
        enum: ['حمار', 'بقر', 'جاموس', 'أغنام', 'ماعز', 'حصان', 'دواجن', 'أرانب'], 
        required: true
    },
    originDetermination: {
        insectRelatedIssues: Boolean,  
        bacterialIssues: Boolean,      
        viralIssues: Boolean,          
        infectionsAndParasites: Boolean, 
        newIssues: Boolean,            
        respiratoryIssues: Boolean,    
        traumasAndInheritance: Boolean, 
        notDetermined: Boolean         
    },
    diagnosticQuestions: {
        naturalBehavior: String, 
        drinksWater: String,
        movesNormally: String,
        normalAppetite: String,
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
        caseLocation: String 
    },
    images: [{
        url: String, 
        publicId: String 
    }]
});


const AnimalCase = mongoose.model('AnimalCase', animalCaseSchema);


module.exports = AnimalCase;