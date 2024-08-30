// Import the Blog model and any other necessary modules
import Blog from "../models/blogModel";

// Create a new blog post
export const createBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    // Create a new blog with the author as the logged-in user
    const blog = new Blog({
      title,
      content,
      author: req.user._id, // Assuming `req.user` is set by your auth middleware
    });

    // Save the blog to the database
    await blog.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get all blog posts
export const getBlogs = async (req, res) => {
  try {
    // Retrieve all blogs, populating the author's information
    const blogs = await Blog.find().populate("author", "name email");
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get a single blog post by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Update a blog post
export const updateBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    // Find the blog post by ID and update it
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
  try {
    // Find the blog post by ID and delete it
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
