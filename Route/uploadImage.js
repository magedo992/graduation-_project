const express = require("express");
const router = express.Router();
const { upload, resizeImages } = require("../Middelware/resizeImage");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Render the upload form
router.get("/", (req, res) => {
  res.render("upload", { imageUrls: [] }); // Ensure imageUrls is always defined
});

// Handle image upload & resizing
router.post("/upload", upload.array("images", 15), resizeImages({ width: 1024, height: 1024, quality: 90 }), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadFromBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      if (!fileBuffer) {
        return reject(new Error("Invalid file buffer"));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "planet" ,format:'png'},
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

  try {
    const uploadPromises = req.files.map((file) => uploadFromBuffer(file.buffer));
    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map((result) => result.secure_url);

    // Render EJS with uploaded images
    res.render("upload", { imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading images", error });
  }
});

module.exports = router;
