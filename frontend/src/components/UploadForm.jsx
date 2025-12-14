import { useState, useEffect } from "react";
import { api } from "../api.js";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await api.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    await api.post("/posts", formData);
    fetchPosts();
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>

      <hr />

      {posts.map((p) => (
        <div key={p._id}>
          <h4>{p.title}</h4>
          <img src={p.image} width="200" />
        </div>
      ))}
    </>
  );
};

export default UploadForm;
