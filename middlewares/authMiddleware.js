import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected routes token base
// -- because its middleware we have to provide next
// this is middleware function we can use inbetween paths to authenticate and protect the path
export const requireSignIn = (req, res, next) => {
  try {
    // decoding
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // we have to decrypt and adding to the req as and req.user object

    req.user = decode;
    // next should be there to execute the next task
    next();
  } catch (error) {
    console.log(error);
  }
};

// middleware for admin access

export const isAdmin = async (req, res, next) => {
  try {
    // 1.need to check weather the user is admin or not
    // user.role = 1 means admin

    const user = await userModel.findById(req.user._id);

    if (user.role !== 1) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorise Access" });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Some Error",
      error,
    });
    console.log(error);
  }
};
