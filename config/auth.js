import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_JWT);
    // console.log(decode);
    req.user = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};
