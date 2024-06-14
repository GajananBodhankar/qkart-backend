const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const { default_wallet_money } = require("../config/config");

/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 *
 */
async function getUserById(id) {
  let result = await User.findById(id);
  let s = await User.find();
  return result;
}

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */

async function getUserByEmail(email) {
  const result = await User.findOne({ email: email });
  return result;
}
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */

async function createUser(userBody) {
  const { email } = userBody;
  const isEmailTaken = await User.isEmailTaken(email);
  if (isEmailTaken) {
    throw new ApiError(200, "Email already taken");
  }
  const hashedPassword = await bcrypt.hash(userBody.password, 10);
  const user = await User.create({ ...userBody, password: hashedPassword });
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    walletMoney: parseInt(user.walletMoney)
      ? parseInt(user.walletMoney)
      : default_wallet_money,
  };
}

// TODO: CRIO_TASK_MODULE_CART - Implement getUserAddressById()
/**
 * Get subset of user's data by id
 * - Should fetch from Mongo only the email and address fields for the user apart from the id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserAddressById = async (id) => {
  const user = await User.findOne({ _id: id },{ email: 1, address: 1 })
  return user;
};

/**
 * Set user's shipping address
 * @param {String} email
 * @returns {String}
 */
const setAddress = async (user, newAddress) => {
  user.address = newAddress;
  await user.save();

  return user.address;
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  getUserAddressById,
  setAddress,
};
