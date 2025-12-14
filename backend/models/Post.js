import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  image: String,
});

export default mongoose.model("Post", postSchema);
