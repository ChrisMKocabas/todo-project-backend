// load mongoose since we need it to define a model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
UserSchema = new Schema({
  user_id: String,
  email: String,
  password: String,
  fullname: String,
  address: {
    street: String,
    city: String,
    province: String,
    zipcode: String,
    country: String,
  },
  DOB: Date,
  refreshToken: String,

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Review",
    },
  ],
});
module.exports = mongoose.model("User", UserSchema, "users");
