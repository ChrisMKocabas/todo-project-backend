// load mongoose since we need it to define a model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ReviewSchema = new Schema({
  author_id: String,
  author_name: String,
  review_id: String,
  title: String,
  content: String,
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Review", ReviewSchema, "reviews");
