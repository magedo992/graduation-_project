const Fertilizer = require('../models/fertilizerModel');


exports.create = asyncHandler(async (req, res, next) => {
    // Function to upload a file buffer to Cloudinary
    const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
            if (!fileBuffer) {
                return reject(new Error('Invalid file buffer'));
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'Fertilizer' },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    };

   
    if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("No files uploaded", 400));
    }

    
    const uploadPromises = req.files.map(file => uploadFromBuffer(file.buffer));
    const results = await Promise.all(uploadPromises);

   
    const fertilizer = new fertilizerModel({
        ...req.body,
        images: results.map(result => ({ url: result.secure_url })) 
    });

    await fertilizer.save();
    res.status(201).send(fertilizer);
});
////////////
exports.getAllFertilizers = asyncHandler(async (req, res) => {
  const fertilizers = await Fertilizer.find();
  res.json(fertilizers);
});



exports.getFertilizerById = asyncHandler(async (req, res) => {
  const fertilizer = await Fertilizer.findById(req.params.id);
  if (!fertilizer) return res.status(404).json({ message: 'Fertilizer not found' });
  res.json(fertilizer);
});


exports.addFertilizer = asyncHandler(async (req, res) => {
  const fertilizer = new Fertilizer(req.body);
  const newFertilizer = await fertilizer.save();
  res.status(201).json({message: 'New Fertilizer added'});
});


exports.updateFertilizer = asyncHandler(async (req, res) => {
  const fertilizer = await Fertilizer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!fertilizer) return res.status(404).json({ message: 'Fertilizer not found' });
  res.json(fertilizer);
});


exports.deleteFertilizer = asyncHandler(async (req, res) => {
  const fertilizer = await Fertilizer.findByIdAndDelete(req.params.id);
  if (!fertilizer) return res.status(404).json({ message: 'Fertilizer not found' });
  res.json({ message: 'Fertilizer deleted' });
});
