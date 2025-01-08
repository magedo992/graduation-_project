const sharp = require('sharp');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const resizeImage = (options) => {
  return async (req, res, next) => {
    if (!req.body.ProfileImage) {
      console.log('No Base64 image provided');
      return next();
    }

    const { width = 800, height = 800, quality = 80 } = options;

    try {
      // Remove the Base64 prefix, if present
      const base64String = req.body.ProfileImage.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64String, 'base64');

      // Resize the image
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(width, height)
        .rotate()
        .toFormat('jpeg')
        .jpeg({ quality: quality })
        .toBuffer();

      // Convert back to Base64 after resizing
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

  const resizeImages = (options) => {
    return async (req, res, next) => {
      if (!req.files || req.files.length === 0) {
        console.log('No files uploaded or parsed correctly');
        return next();
      }
  
      const { width = 800, height = 800, quality = 80 } = options;
  
      try {
        req.files = await Promise.all(req.files.map(async (file) => {
          const resizedImageBuffer = await sharp(file.buffer)
            .resize(width, height)
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
  
  // module.exports = { upload, };
  
module.exports = { upload,resizeImage , resizeImages };
