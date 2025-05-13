const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (file, folder, resourceType) => {
  try {
    const publicId = `${file.originalname.split(".")[0]}_${Date.now()}`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: folder,
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          public_id: publicId,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    return result.secure_url;
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file.", message: error.message });
  }
};

const extractPublicId = (url) => {
  // Check if URL exists and contains cloudinary
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Handle URLs with the /upload/ path and version
    const uploadMatch = url.match(/\/upload\/v\d+\/(.*?)(?:\.|$)/);
    if (!uploadMatch || !uploadMatch[1]) return null;
    
    // Return the matched public ID
    return uploadMatch[1];
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
}

module.exports = {uploadToCloudinary, extractPublicId, deleteFromCloudinary};