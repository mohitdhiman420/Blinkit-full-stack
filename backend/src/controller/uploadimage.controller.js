const uploadImageClodinary = require("../db/cloudinary");

async function uploadimagecontroller(req, resp) {
  try {
    const file = req.file;

    const uploadimage = await uploadImageClodinary(file);

    if (!uploadimage) {
      return resp.status(400).json({
        message: "Please Provide file",
        error: true,
        success: false,
      });
    }   

    return resp.status(200).json({
      message: "upload image success",
      error: false,
      success: true,
      data : uploadimage,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = {uploadimagecontroller}