// Import express and controller
import express from 'express';
import { registerUser, loginUser, logoutUser, profile,refreshAccessToken} from '../controllers/userControllers.js'; // Include .js if using ES Modules
import verifyJWT from '../middlerware/auth.midddleware.js';  // Corrected typo: 'middleware.js'

// Create a Router instance
const router = express.Router();

// Define the POST route for user registration
router.post("/signup", registerUser);

// Login route (POST)
router.route("/signin").post(loginUser);

// Logout route (POST)
router.route("/logout").post(logoutUser);

// Profile route (GET) - Protected by verifyJWT middleware
router.route("/profile").get(verifyJWT, profile);
router.post("/refresh-token", refreshAccessToken);

// Export the router
export default router;