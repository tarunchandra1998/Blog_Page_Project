import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import blogModel from "../models/blogModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation

    if (!name) {
      return res.send({ message: "Name Is Required" });
    }
    if (!email) {
      return res.send({ message: "email Is Required" });
    }

    if (!password) {
      return res.send({ message: "password Is Required" });
    }
    if (!phone) {
      return res.send({ message: "phone Is Required" });
    }
    if (!address) {
      return res.send({ message: "address Is Required" });
    }

    // check user

    const existingUser = await userModel.findOne({ email });
    // existing user
    if (existingUser) {
      res.status(200).send({
        success: false,
        message: "User Already Resistered, Please Login!",
      });
    }

    // resister user

    const hashedPassword = await hashPassword(password);
    // save

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Invalid Username Or Password",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email Not Registed",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login",
      error,
    });
  }
};

// test controller

export const testController = async (req, res) => {
  try {
    res.send("this is protected routes");
  } catch (error) {
    console.log(error);
  }
};

// Create a new blog post
export const createBlogController = async (req, res) => {
  const { title, content } = req.body;
  console.log(req.user);
  
 // const author = req.user._id; // Assuming req.user is set by an authentication middleware

  try {
    const blog = new blogModel({ title, content, author });
    await blog.save();
    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// Get all blog posts
export const getBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate("author", "name email");
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get a single blog post by ID
export const getBlogByIdController = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id).populate(
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
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Update a blog post
export const updateBlogController = async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await blogModel.findByIdAndUpdate(
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
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Delete a blog post
export const deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);

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
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
