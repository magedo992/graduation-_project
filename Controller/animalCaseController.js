const asyncHandler = require('express-async-handler');
const animalCaseModel = require('../Model/animalCaseModel');
const { ErrorHandler } = require('../Utils/ErrorHandler');
const { cloudinary } = require('../Middelware/uploadImage');
const sharp = require('sharp');


exports.createAnimalForm = asyncHandler(async (req, res, next) => {
  const {
    animalType,
    originDetermination,
    diagnosticQuestions,
    contactInformation,
    images,
    notes,
  } = req.body;

  if (!animalType || !contactInformation) {
    return next(new ErrorHandler("نوع الحيوان ومعلومات الاتصال مطلوبة", 400));
  }

  const processedImages = [];

 
  if (images && Array.isArray(images)) {
    const imagesToProcess = images.slice(0, 3);

    for (const base64Image of imagesToProcess) {
      try {
        const buffer = Buffer.from(base64Image, 'base64');

        if (buffer.length === 0) {
          console.warn('Empty image buffer - skipping');
          continue;
        }

        const processedBuffer = await sharp(buffer)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .rotate()
          .toFormat('jpeg', { quality: 80, mozjpeg: true })
          .toBuffer();

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'AnimalCases',
              format: 'jpg',
              quality: 'auto:good',
            },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          uploadStream.end(processedBuffer);
        });

        processedImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      } catch (err) {
        console.error('Error processing image:', err.message);
        continue;
      }
    }
  }

  try {
    const animalCase = await animalCaseModel.create({
      animalType,
      originDetermination,
      diagnosticQuestions,
      contactInformation,
      images: processedImages,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "تم إنشاء الحالة بنجاح",
      data: animalCase,
    });
  } catch (dbError) {
    console.error('Database error:', dbError);
    next(new ErrorHandler("حدث خطأ أثناء حفظ البيانات", 500));
  }
});
