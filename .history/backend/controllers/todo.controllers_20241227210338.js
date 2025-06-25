import Todo from "../model/todo.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add Task
export const addTask = asyncHandler(async (req, res) => {
  const { heading, text } = req.body;

  if (!heading || !text) {
    return res.status(400).json({ message: "Heading and text are required" });
  }

  // Create and save the todo in a single step
  const newTodo = await Todo.create({
    heading,
    text,
    user: req.user.userId,
  });

  res.status(201).json({
    message: "Todo added successfully",
    todo: newTodo,
  });
});

// Update Task
export const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { heading, text } = req.body;

  // Update the todo and return the new document in one step
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: todoId, user: req.user.userId }, // Ensure user owns the task
    { heading, text },
    { new: true } // Return the updated document
  );

  if (!updatedTodo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({ message: "Todo updated successfully", todo: updatedTodo });
});

// Delete Task
export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  // Find and delete the todo in one step
  const deletedTodo = await Todo.findOneAndDelete({
    _id: todoId,
    user: req.user.userId,
  });

  if (!deletedTodo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({ message: "Todo deleted successfully" });
});

// Get All Todos for a User
export const getTodosByUser = asyncHandler(async (req, res) => {
  // Fetch todos in one query
  const todos = await Todo.find({ user: req.user.userId });

  res.status(200).json({
    message: todos.length ? "Todos fetched successfully" : "No tasks found",
    todos,
  });
});
