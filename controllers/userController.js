import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User alrready exist.",
        success: false,
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 16);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_JWT, {
      expiresIn: "1d",
    });
    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `Welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = (req, res) => {
  return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "User logged out successfully",
    success: true,
  });
};

export const Bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUserId);
    if (user.bookmarks.includes(tweetId)) {
      // remove tweet from bookmark
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: "Tweet removed from bookmarks.",
        success: true,
      });
    } else {
      // bookmark tweet
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: "Tweet saved to bookmark.",
        success: true,
      });
    }
  } catch (error) {}
};

export const userProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const otherUsers = await User.find({ _id: { $ne: id } }).select(
      "-password"
    );
    if (!otherUsers) {
      return res.status(401).json({
        message: "Currently do not have any users",
        success: false,
      });
    }
    return res.status(200).json({
      otherUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const follow = async (req, res) => {
  try {
    // loggedin user (self)
    const loggedInUserId = req.body.id;
    // another user
    const anotherUserId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const anotherUser = await User.findById(anotherUserId);

    if (!anotherUser.followers.includes(loggedInUserId)) {
      await anotherUser.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: anotherUserId } });
    } else {
      // await anotherUser.updateOne({ $pull: { followers: loggedInUserId } });
      // await loggedInUser.updateOne({ $pull: { following: anotherUserId } });
      return res.status(400).json({
        message: `You already follows ${anotherUser.name}`,
        success: true,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} is following ${anotherUser.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const unFollow = async (req, res) => {
  try {
    // loggedin user (self)
    const loggedInUserId = req.body.id;
    // another user
    const anotherUserId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const anotherUser = await User.findById(anotherUserId);

    if (anotherUser.followers.includes(loggedInUserId)) {
      await anotherUser.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: anotherUserId } });
    } else {
      return res.status(400).json({
        message: `You do not follow ${anotherUser.name}`,
        success: true,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.name} unfollows ${anotherUser.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
