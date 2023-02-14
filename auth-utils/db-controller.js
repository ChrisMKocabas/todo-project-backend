const mongoose = require("mongoose");
require("dotenv").config();
const database = { url: process.env.USERS_DB_URL };
const User = require("../model/User");
mongoose.set("strictQuery", false);

//Check connection to DB
const initialize = async function initialize(db) {
  try {
    console.log("Connecting to the database...");
    await mongoose.connect(db.url);
    console.log("Connection established.");
    return User;
  } catch (err) {
    console.log("Failed to connect to Atlas!", err);
  }
};

//Check if user already exists
async function checkUserExist(data) {
  try {
    const findUser = await User.findOne({
      email: { $regex: data, $options: "i" },
    }).exec();
    return findUser;
  } catch (err) {
    console.log("Can not check if user exists!");
    return false;
  }
}

//Add new user
async function addUser(data) {
  try {
    const newUser = await User.create(data);
    const findNewUser = await User.find({
      user_id: newUser.user_id,
    }).exec();
    return findNewUser;
  } catch (err) {
    console.log("Unable to add new user.", err);
  }
}

//Get user by user id
async function getUserById(Id) {
  try {
    const user = await User.findById(Id).lean().exec();
    return user;
  } catch (err) {
    console.log("Unable to find user.");
  }
}

//Update user
async function updateUserbyID(data, Id) {
  try {
    let user = await User.findByIdAndUpdate({ _id: Id }, data, {
      new: true,
    })
      .lean()
      .exec();
    return user;
  } catch (err) {
    console.log("Unable to update user.", err);
  }
}

//Delete user
async function deleteUserById(Id) {
  try {
    // const deletedRestaurant = await find;
    const deletedUser = await User.findByIdAndRemove(Id).lean().exec();
    console.log(`${deletedUser.username} was deleted successfully.`);
    return deletedUser;
  } catch (err) {
    console.log("Unable to delete user.", err);
  }
}

module.exports = {
  initialize,
  checkUserExist,
  addUser,
  getUserById,
  updateUserbyID,
  deleteUserById,
  database,
  User,
};
