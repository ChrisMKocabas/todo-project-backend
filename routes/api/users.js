const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const verifyUserPrivilige = require("../../middleware/verifyUserPrivilige");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(verifyUserPrivilige(), usersController.createNewUser)
  .put(verifyUserPrivilige(), usersController.updateUser)
  .delete(verifyUserPrivilige(), usersController.deleteUser);

router.route("/:id").get(usersController.getUser);

module.exports = router;
