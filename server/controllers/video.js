import videoFiles from "../models/videoFiles.js";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "ytclone" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

export const uploadVideo = async (req, res, next) => {
  if (!req.file) {
    return res.status(404).json({ message: "Please upload a .mp4 video file only" });
  }
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    const file = new videoFiles({
      videoTitle: req.body.title,
      fileName: req.file.originalname,
      filePath: result.secure_url,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      videoChanel: req.body.chanel,
      Uploder: req.body.Uploder,
    });
    await file.save();
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllvideos = async (req, res) => {
  try {
    const files = await videoFiles.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await videoFiles.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (video.videoChanel !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });
    await videoFiles.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
