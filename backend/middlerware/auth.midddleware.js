import jwt from "jsonwebtoken";
import ApiError from "../utils/apierror.js"; 
import asyncHandler from "../utils/asyncHandler.js";// Ensure you have ApiError properly implemented

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      throw new ApiError("Unauthorized: No token provided", 401);
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decodedToken); // Check the decoded token for any issues
    req.user = { userId: decodedToken.userId }; // Attach userId from token to req.user
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError("Access token expired", 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError("Invalid token", 401);
    } else {
      throw new ApiError(error.message || "Unauthorized access", 401);
    }
  }
});

export default verifyJWT;
