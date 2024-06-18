const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudinaryService = {
  uploadImage: async (imagePath) => {
    try {
      const result = await cloudinary.uploader.upload(imagePath);
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  },

  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw error;
    }
  },
};

module.exports = cloudinaryService;
