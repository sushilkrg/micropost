import express from "express";
import {
  Register,
  Login,
  Logout,
  userProfile,
  getOtherUsers,
  Bookmark,
  follow,
  unFollow,
} from "../controllers/userController.js";
import { isAuthenticated } from "../config/auth.js";

const router = express.Router();

// router.route("/register").post(Register);
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/profile/:id", userProfile);
router.get("/otherusers/:id",isAuthenticated, getOtherUsers);
router.put("/bookmark/:id", isAuthenticated, Bookmark);
router.post("/follow/:id", isAuthenticated, follow);
router.post("/unfollow/:id", isAuthenticated, unFollow);

export default router;
