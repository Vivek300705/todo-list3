import mongoose from "mongoose";
import { z } from "zod";

// Define Zod schemas for email and password validation
const emailSchema = z.string().email("Invalid email format");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character");

// Mongoose Schema definition
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }], // Store references to Todo model
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to validate before saving
userSchema.pre("save", function (next) {
  // Validate email
  try {
    emailSchema.parse(this.email);  // `this` refers to the document being saved
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new Error(err.errors.map(e => e.message).join(", ")));
    }
  }

  // Validate password
  try {
    passwordSchema.parse(this.password);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new Error(err.errors.map(e => e.message).join(", ")));
    }
  }

  next();
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
