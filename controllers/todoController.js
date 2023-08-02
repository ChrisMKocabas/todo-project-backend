const Todo = require("../model/Todo");

const getTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }
    res.json(todo);
  } catch (err) {
    console.error("Error fetching todo:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.user_id });
    if (!todos || todos.length === 0) {
      return res.status(204).json({ message: "No todos found." });
    }
    res.json(todos);
  } catch (err) {
    console.error("Error fetching all todos:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const createNewTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log("req.user.user_id:", req.user.user_id); // Check the user_id before creating the todo
    const newTodo = await Todo.create({
      title,
      description,
      status: false,
      user: req.user.user_id,
    });
    console.log("newTodo:", newTodo); // Check the newly created todo object
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(400).json({ message: "Invalid request data." });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const { title, description, status } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, description, status },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(204).json({ message: "No todo matches ID." });
    }
    res.json(updatedTodo);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if (!deletedTodo) {
      return res.status(204).json({ message: "No todo matches ID." });
    }
    res.json(deletedTodo);
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  getAllTodos,
  createNewTodo,
  updateTodo,
  deleteTodo,
  getTodo,
};
