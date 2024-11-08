const sharp = require('sharp');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const resizeImage = (options) => {
    return async (req, res, next) => {
     
      
        if (!req.file) {
        console.log('No file uploaded or parsed correctly');
        return next(); 

      }
      
  
      const { width = 800, height = 800, quality = 80 } = options;
  
      try {
        const resizedImageBuffer = await sharp(req.file.buffer)
          .resize(width, height)
          .rotate()
          .toFormat('jpeg')
          .jpeg({ quality: quality })
          .toBuffer();
  
        req.file.buffer = resizedImageBuffer;
  
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
