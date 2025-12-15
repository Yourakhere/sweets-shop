import { useState, useEffect } from "react";
import { api } from "../api.js";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      await api.post("/posts", formData);
      fetchPosts();
      setTitle("");
      setImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-orange-100 my-8">
      <h2 className="text-2xl font-bold text-amber-800 mb-6">Upload New Post</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Image</label>
          <input
            type="file"
            className="w-full px-4 py-3 rounded-lg border-2 border-orange-100 focus:border-amber-500 focus:outline-none transition-colors"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        >
          Upload
        </button>
      </form>

      <hr className="my-8 border-orange-100" />

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Recent Posts</h3>
        {posts.map((p) => (
          <div key={p._id} className="p-4 rounded-lg bg-orange-50 border border-orange-100 flex gap-4 items-center">
            {p.image && <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded-lg shadow-sm" />}
            <h4 className="text-lg font-bold text-gray-800">{p.title}</h4>
          </div>
        ))}
        {posts.length === 0 && <p className="text-gray-500 text-center">No posts found.</p>}
      </div>
    </div>
  );
};

export default UploadForm;
