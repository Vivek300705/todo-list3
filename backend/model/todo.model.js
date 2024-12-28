import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true, // Fixed typo `require` -> `required`
    },
    text: {
      type: String,
      required: true,
    },
    user:
      [{type: mongoose.Schema.Types.ObjectId, // Reference to a single user
      ref: "User", // Referencing the User model
      required: true,}]
    ,
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;