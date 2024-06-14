const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");
const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const User = require("../../models").User;
const router = express.Router();

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`
// validate then request

// router.get("/", async (req, res) => {
// let data = await User.findById("");
// return res.json(data);
// });

// router.post("/", userController.createUser);

// router.use(auth);
const auth = require("../../middlewares/auth");
router.get(
  "/:userId",auth,
  validate(userValidation.getUser),
  userController.getUser)



router.put(
  "/:userId",
  auth,
  validate(userValidation.setAddress),
  userController.setAddress
);

module.exports = router;
