const Animal = require('../Model/animalModel');
const asyncHandler = require('express-async-handler');
const streamifier = require('streamifier');
const { cloudinary } = require('../Middelware/uploadImage');

const uploadFromBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'Animals', format: 'png' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

// Render the add animal form
exports.getAddAnimalForm = asyncHandler((req, res) => {
    res.render('addAnimal', { error: null });
});

// Add a new animal
exports.addAnimal = asyncHandler(async (req, res, next) => {
    try {
        const { scientificName, commonName, description, nutrition, lifeCycle, health, care, production, behavior, additionalInfo } = req.body;

        let result = null;
        if (req.file) {
            try {
                result = await uploadFromBuffer(req.file.buffer);
            } catch (error) {
                console.error("Image Upload Error:", error);
                return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
            }
        }

        const parseDiseases = (input) => {
            if (!input) return [];
            return Array.isArray(input) ? input.map(d => ({
                nameArabic: d.nameArabic || "",
                nameEnglish: d.nameEnglish || "",
                symptoms: d.symptoms ? d.symptoms.split(',').map(s => s.trim()) : [],
                treatment: d.treatment || "",
                prevention: d.prevention || ""
            })) : [];
        };
        
        const newAnimal = new Animal({
            scientificName,
            commonName,
            image: result ? result.secure_url : "default.png",
            description,
            nutrition: {
                dietType: nutrition?.dietType,
                suitableFeeds: nutrition?.suitableFeeds ? nutrition.suitableFeeds.split(',') : [],
                dailyFoodIntake: nutrition?.dailyFoodIntake,
                dailyWaterNeeds: nutrition?.dailyWaterNeeds,
                forbiddenFoods: nutrition?.forbiddenFoods ? nutrition.forbiddenFoods.split(',') : []
            },
            lifeCycle: {
                averageLifespan: lifeCycle?.averageLifespan,
                sexualMaturityAge: lifeCycle?.sexualMaturityAge,
                gestationPeriod: lifeCycle?.gestationPeriod,
                offspringPerBirth: lifeCycle?.offspringPerBirth
            },
            health: {
                commonDiseases: parseDiseases(health?.commonDiseases) // ✅ Now stores an array of objects
            },
            care: {
                livingConditions: {
                    temperature: care?.livingConditions?.temperature,
                    humidity: care?.livingConditions?.humidity,
                    shelterType: care?.livingConditions?.shelterType
                },
                vaccinationSchedule: care?.vaccinationSchedule ? care.vaccinationSchedule.split(',') : [],
                hygieneCare: care?.hygieneCare,
                emergencyHandling: care?.emergencyHandling
            },
            production: {
                benefits: production?.benefits ? production.benefits.split(',') : [],
                optimizationMethods: production?.optimizationMethods ? production.optimizationMethods.split(',') : []
            },
            behavior: {
                nature: behavior?.nature,
                handlingGuidelines: behavior?.handlingGuidelines,
                comfortSigns: behavior?.comfortSigns ? behavior.comfortSigns.split(',') : [],
                stressSigns: behavior?.stressSigns ? behavior.stressSigns.split(',') : []
            },
            additionalInfo: {
                expertTips: additionalInfo?.expertTips,
                interestingFacts: additionalInfo?.interestingFacts ? additionalInfo.interestingFacts.split(',') : []
            }
        });
        
        await newAnimal.save();
        res.status(201).json({message:"created suceess"});
    } catch (error) {
        console.error("Error Adding Animal:", error);
        res.status(400).json({ status: "error", message: error.message });
    }
});

exports.viewAnimals = asyncHandler(async (req, res) => {
   
        const animals = await Animal.find();
        res.status(200).json({ data: animals });
  
});
