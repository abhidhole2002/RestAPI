const cloudinary = require("./cloudinary");
const User = require("../models/user");

const uploadImageToCloudinary = (req, res) => {
  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error uploading image",
      });
    }

    try {
      const { id } = req.params;
      let user = await User.findById(id, { password: 0 });

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      if (user.profileImage) {
        return res.status(400).json({
          success: false,
          message: "User already has a profile image",
        });
      }

      user.profileImage = result.url;
      user = await user.save();

      res.json({
        message: "Image uploaded and profileImage added successfully",
        imageUrl: user.profileImage,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send({ error: "Server error" });
    }
  });
};

module.exports = uploadImageToCloudinary;
