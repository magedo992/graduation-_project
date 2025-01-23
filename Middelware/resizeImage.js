const sharp = require('sharp');
const multer = require('multer');

// إعداد تخزين الصور في الذاكرة باستخدام multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// دالة لتصغير صورة واحدة
const resizeImage = (options) => {
  return async (req, res, next) => {
    if (!req.body.ProfileImage) {
      console.log('No Base64 image provided');
      return next();
    }

    const { width = 800, height = 800, quality = 80, background = { r: 255, g: 255, b: 255, alpha: 1 } } = options;

    try {
      // إزالة بادئة Base64 إذا كانت موجودة
      const base64String = req.body.ProfileImage.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64String, 'base64');

      // تصغير الصورة بدون قص
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(width, height, { fit: 'contain', background }) // الحفاظ على النسبة الأصلية
        .rotate()
        .toFormat('jpeg')
        .jpeg({ quality: quality })
        .toBuffer();

      // إعادة الصورة بصيغة Base64 بعد التعديل
      req.file = {
        buffer: resizedImageBuffer,
        base64: `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`
      };

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error resizing image', error });
    }
  };
};

// دالة لتصغير صور متعددة
const resizeImages = (options) => {
  return async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded or parsed correctly');
      return next();
    }

    const { width = 800, height = 800, quality = 80, background = { r: 255, g: 255, b: 255, alpha: 1 } } = options;

    try {
      req.files = await Promise.all(req.files.map(async (file) => {
        // تصغير كل صورة مع الحفاظ على النسبة الأصلية
        const resizedImageBuffer = await sharp(file.buffer)
          .resize(width, height, { fit: 'contain', background }) // الحفاظ على النسبة الأصلية
          .rotate()
          .toFormat('jpeg')
          .jpeg({ quality: quality })
          .toBuffer();

        return {
          ...file,
          buffer: resizedImageBuffer,
        };
      }));

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error resizing images', error });
    }
  };
};

// تصدير الدوال
module.exports = { upload, resizeImage, resizeImages };
