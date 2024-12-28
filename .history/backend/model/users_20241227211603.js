import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"] },
    password: {
      type: String, required: true, match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
,"please"] },
    list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }], // Store references to Todo model
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
