// Import express and controller
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  profile, 
  refreshAccessToken,
  updateProfile,
  changePassword
} from '../controllers/userControllers.js'; 
import verifyJWT from '../middlerware/auth.midddleware.js';  

// Create a Router instance
const router = express.Router();

// Authentication routes
router.post("/register", registerUser);           // POST /api/register
router.post("/login", loginUser);                 // POST /api/login  
router.post("/logout", logoutUser);               // POST /api/logout
router.post("/refresh-token", refreshAccessToken); // POST /api/refresh-token

// Protected routes (require authentication)
router.get("/profile", verifyJWT, profile);                    // GET /api/profile
router.put("/profile", verifyJWT, updateProfile);              // PUT /api/profile  
router.put("/change-password", verifyJWT, changePassword);     // PUT /api/change-password

// Alternative routes for backward compatibility (if needed)
router.post("/signup", registerUser);            // POST /api/signup (alias for register)
router.post("/signin", loginUser);               // POST /api/signin (alias for login)

// Export the router
export default router;