import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/users.js";

dotenv.config();

// Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ 
      status: false, 
      message: "All fields are required" 
    });
  }

  // Validate input formats
  if (username.trim().length < 3) {
    return res.status(400).json({ 
      status: false, 
      message: "Username must be at least 3 characters long" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      status: false, 
      message: "Password must be at least 6 characters long" 
    });
  }

  // Check if email is valid
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      status: false, 
      message: "Please enter a valid email address" 
    });
  }

  try {
    // Check if user exists by email or username
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase().trim() ? 'Email' : 'Username';
      return res.status(409).json({ 
        status: false, 
        message: `${field} already registered` 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({ 
      username: username.toLowerCase().trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword 
    });

    await newUser.save();

    res.status(201).json({ 
      status: true, 
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        status: false, 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    return res.status(500).json({ 
      status: false, 
      message: "Internal server error during registration" 
    });
  }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ 
      status: false, 
      message: "Username/Email and password are required" 
    });
  }

  try {
    // Find user by username or email
    const user = await User.findOne({ 
      $or: [
        { username: username.toLowerCase().trim() },
        { email: username.toLowerCase().trim() }
      ]
    }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        status: false, 
        message: "Invalid credentials" 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        status: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Cookie options
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const accessCookieOptions = {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000 // 1 hour
    };

    // Set cookies and send response
    res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ 
        status: true, 
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          },
          accessToken,
          refreshToken
        }
      });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      status: false, 
      message: "Internal server error during login" 
    });
  }
});

// Refresh Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ 
      status: false, 
      message: "Refresh token required" 
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }

    // Generate new access token
    const { accessToken } = generateTokens(user);
    
    // Cookie options for new access token
    const isProduction = process.env.NODE_ENV === 'production';
    const accessCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOptions)
      .json({ 
        status: true, 
        message: "Token refreshed successfully", 
        accessToken 
      });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Clear invalid cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    return res.status(401).json({ 
      status: false, 
      message: "Invalid or expired refresh token" 
    });
  }
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    res.status(200).json({ 
      status: true, 
      message: "Logged out successfully" 
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      status: false, 
      message: "Error during logout" 
    });
  }
});

// Get User Profile
export const profile = asyncHandler(async (req, res) => {
  try {
    // Find user by ID from JWT token
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      status: true, 
      message: "Profile fetched successfully", 
      data: {
        profile: user
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ 
      status: false, 
      message: "Error fetching profile" 
    });
  }
});

// Update User Profile
export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.userId;

    // Build update object
    const updateData = {};
    if (username) updateData.username = username.toLowerCase().trim();
    if (email) {
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          status: false, 
          message: "Please enter a valid email address" 
        });
      }
      updateData.email = email.toLowerCase().trim();
    }

    // Check for existing users with same username or email
    if (Object.keys(updateData).length > 0) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } }, // Exclude current user
          {
            $or: [
              ...(updateData.username ? [{ username: updateData.username }] : []),
              ...(updateData.email ? [{ email: updateData.email }] : [])
            ]
          }
        ]
      });

      if (existingUser) {
        const field = existingUser.username === updateData.username ? 'Username' : 'Email';
        return res.status(409).json({ 
          status: false, 
          message: `${field} already taken` 
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      status: true, 
      message: "Profile updated successfully", 
      data: {
        profile: updatedUser
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        status: false, 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    return res.status(500).json({ 
      status: false, 
      message: "Error updating profile" 
    });
  }
});

// Change Password
export const changePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        status: false, 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        status: false, 
        message: "New password must be at least 6 characters long" 
      });
    }

    // Find user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        status: false, 
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ 
      status: true, 
      message: "Password changed successfully" 
    });

  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ 
      status: false, 
      message: "Error changing password" 
    });
  }
});