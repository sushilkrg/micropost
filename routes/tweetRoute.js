import express from "express";
import { isAuthenticated } from "../config/auth.js";
import {
  createTweet,
  deleteTweet,
  likeOrDislikeTweet,
  getAllTweets,
  getFollowingUsersTweets,
} from "../controllers/tweetController.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTweet);
router.delete("/delete/:id", isAuthenticated, deleteTweet);
router.put("/like/:id", isAuthenticated, likeOrDislikeTweet);
router.get("/alltweets/:id", isAuthenticated, getAllTweets);
router.get("/followinguserstweets/:id", isAuthenticated, getFollowingUsersTweets);

export default router;
