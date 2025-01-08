const cloudinary = require('cloudinary').v2;




const uploadFromBase64 = (base64Image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base64Image, { folder: 'UserProfile' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = { uploadFromBase64 };