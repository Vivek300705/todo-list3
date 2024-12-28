import mongoose from "mongoose";

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

const User = mongoose.model("User", userSchema);
export default User;
