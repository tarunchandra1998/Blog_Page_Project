import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import "../styles/AuthStyles.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [auth] = useAuth(); // Getting auth context

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creating a new blog post
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/blogs/create`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Sending token for authentication
          },
        }
      );
      console.log("response", response);

      if (response && response.data.success) {
        console.log(response.data.message);
        toast.success(response.data.message);
        // Redirecting to the home page or blog list page after successful creation
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Layout title="Create Blog - Blog App">
      <div className="form-container">
        <h1>Create Blog</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="form-control"
              id="blogTitle"
              required
              placeholder="Enter Blog Title"
            />
          </div>

          <div className="form-group">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              className="form-control"
              id="blogContent"
              required
              placeholder="Enter Blog Content"
              rows="5"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Blog
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateBlog;
