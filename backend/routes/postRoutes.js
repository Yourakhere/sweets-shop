import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mern_uploads",
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    image: req.file.path,
  });
  res.json(post);
});

router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

export default router;
