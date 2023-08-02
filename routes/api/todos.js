const express = require("express");
const router = express.Router();
const todoController = require("../../controllers/todoController");

router
  .route("/")
  .get(todoController.getAllTodos)
  .post(todoController.createNewTodo); // Separate POST method for creating a new todo

router
  .route("/:id")
  .get(todoController.getTodo)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

module.exports = router;
