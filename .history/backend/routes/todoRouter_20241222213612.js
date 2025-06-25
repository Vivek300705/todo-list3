import express from "express";
import {
  addTask,
  updateTodo,
  deleteTodo,
  getTodosByUser,
} from "../controllers/todo.controllers.js";
import verifyJWT from "../middlerware/auth.midddleware.js";

const todorouter = express.Router();

todorouter.use(verifyJWT); // Apply middleware to all routes below

// Create a new todo task
todorouter.route("/todo").post(addTask);

// Update an existing todo task
todorouter.route("/todo/:todoId").put(updateTodo);

// Delete a todo task
todorouter.route("/todo/:todoId").delete(deleteTodo);

// Get all todos for the current user (using JWT to identify the user)
todorouter.route("/todos").get(getTodosByUser); // We now get todos for the logged-in user

export default todorouter;
