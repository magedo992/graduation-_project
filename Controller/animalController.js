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

exports.getAddAnimalForm = asyncHandler((req, res) => {
    res.render('addAnimal', { error: null });
});

exports.addAnimal = asyncHandler(async (req, res) => {
    try {
        const {
            scientificName, commonName, description, nutrition,
            lifeCycle, health, care, production, behavior,
            additionalInfo, animalType
        } = req.body;

        if (!scientificName || !commonName || !animalType) {
            return res.status(400).json({
                status: "error",
                message: "scientificName, commonName, and animalType are required"
            });
        }

        
        let vaccinationSchedule = [];
        if (care && care.vaccinationSchedule) {
            for (let key in care.vaccinationSchedule) {
                if (Array.isArray(care.vaccinationSchedule[key])) {
                    vaccinationSchedule = care.vaccinationSchedule[key].map((v, index) => ({
                        vaccine: v.vaccine || '',
                        firstDoseAge: v.firstDoseAge || '',
                        repetition: v.repetition || ''
                    }));
                    break;
                }
            }
        }

        let result = null;
       let imageUrls = ["default.png"]; 
        if (req.files && req.files.length > 0) {
            try {
                imageUrls = await Promise.all(
                    req.files.map(async (file) => {
                        const result = await uploadFromBuffer(file.buffer);
                        return result.secure_url;
                    })
                );
            } catch (error) {
                return res.status(500).json({ status: "error", message: "Image upload failed" });
            }
        }
        console.log(imageUrls);
        


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
            image: imageUrls,
            description,
            nutrition: {
                dietType: nutrition?.dietType,
                suitableFeeds: nutrition?.suitableFeeds?.split(',') || [],
                dailyFoodIntake: nutrition?.dailyFoodIntake?.split(',') || [],
                dailyWaterNeeds: nutrition?.dailyWaterNeeds?.split(',') || [],
                forbiddenFoods: nutrition?.forbiddenFoods?.split(',') || []
            },
            lifeCycle: {
                averageLifespan: lifeCycle?.averageLifespan,
                sexualMaturityAge: lifeCycle?.sexualMaturityAge,
                gestationPeriod: lifeCycle?.gestationPeriod,
                offspringPerBirth: lifeCycle?.offspringPerBirth?.split(',') || []
            },
            health: {
                nameArabic: health?.nameArabic?.split(',') || [],
                symptoms: health?.symptoms,
                treatment: health?.treatment,
                prevention: health?.prevention
            },
            care: {
                environment: care?.environment?.split(',') || [],
                hygiene: care?.hygiene,
                emergencyCases: care?.emergencyCases,
                livingConditions: {
                    temperature: care?.livingConditions?.temperature,
                    humidity: care?.livingConditions?.humidity,
                    shelterType: care?.livingConditions?.shelterType
                },
                vaccinationSchedule
            },
            production: {
                benefits: production?.benefits?.split(',') || [],
                optimizationMethods: production?.optimizationMethods?.split(',') || []
            },
            behavior: {
                nature: behavior?.nature,
                handlingGuidelines: behavior?.handlingGuidelines,
                comfortSigns: behavior?.comfortSigns?.split(',') || [],
                stressSigns: behavior?.stressSigns?.split(',') || []
            },
            additionalInfo: {
                expertTips: additionalInfo?.expertTips,
                interestingFacts: additionalInfo?.interestingFacts?.split(',') || []
            },
            animalType
        });

        await newAnimal.save();
        res.status(201).json({ status: "success", message: "created successfully" });

    } catch (error) {
        console.error("Error Adding Animal:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

exports.viewAnimals = asyncHandler(async (req, res) => {
    try {
        const animals = await Animal.find();
        res.status(200).json({ data: animals });
    } catch (error) {
        console.error("Error Fetching Animals:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});