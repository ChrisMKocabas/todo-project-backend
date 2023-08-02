const Todo = require("../model/Todo");

const verifyUserPrivilige = () => {
  return async (req, res, next) => {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    try {
      const todo = await Todo.findOne({ _id: req.body.todo_id }).exec();
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      if (todo.user !== req.user.user_id) {
        return res
          .status(401)
          .json({ message: "You are not authorized to perform this action" });
      }
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong :(" });
    }
  };
};

module.exports = verifyUserPrivilige;
