const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "vita-drop", // Cloudinary folder (optional)
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary Error:", error);
        return res.status(500).json({ error: "Upload to Cloudinary failed" });
      }

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;
