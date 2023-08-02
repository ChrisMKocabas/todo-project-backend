// load mongoose since we need it to define a model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
UserSchema = new Schema({
  user_id: String,
  email: String,
  password: String,
  username: String,
  refreshToken: String,

  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Todo",
    },
  ],
});
module.exports = mongoose.model("User", UserSchema, "users");
