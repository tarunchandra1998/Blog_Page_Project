import express from "express";
import {
  registerController,
  loginController,
  testController,
  createBlogController,
  getBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//---This file is for authenticating routes(for route protection)

// router object
const router = express.Router();

// routing
//Register || Method POST

router.post("/register", registerController);

// LOGIN || METHOD POST

router.post("/login", loginController);


router.post("/blogs/create", createBlogController);
// router.post("/blogs/create", loginController);

// Test Routes

// two middlewares requireSignIn(token check),isAdmin(admin check)

router.get("/test", requireSignIn, isAdmin, testController);

// protected route auth

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
