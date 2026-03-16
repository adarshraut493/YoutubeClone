import videoFiles from "../models/videoFiles.js";
import fs from "fs";

export const uploadVideo = async (req, res, next) => {
  if (req.file === undefined) {
    res.status(404).json({ message: "plz Upload a '.mp4' video file only " });
  } else {
    try {
      const file = new videoFiles({
        videoTitle: req.body.title,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        videoChanel: req.body.chanel,
        Uploder: req.body.Uploder,
      });
      await file.save();
      res.status(200).send("File uploded successfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
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
    if (video.filePath && fs.existsSync(video.filePath)) {
      fs.unlinkSync(video.filePath);
    }
    await videoFiles.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};