import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"] 
    },
    password: {
      type: String, 
      required: true
    },
    list: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Todo" 
    }], 
  },
  {
    timestamps: true,
  }
);

// Create index for email field
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
