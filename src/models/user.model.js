const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
// const { getUserByEmail } = require("../services/user.service");
const bcrypt = require("bcryptjs");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validator: {
        validate: (value) => {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid Email");
          } else {
            return true;
          }
        },
      },
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error("Invalid Email");
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlenth: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      minlength: 8,
    },
    walletMoney: {},
    address: {
      type: String,
      default: config.default_address,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */

userSchema.statics.isEmailTaken = async function (email) {
  let result = await this.findOne({ email: email });
  return result;
};

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */
 userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};


userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
  //  return user.address === config.default_address;
   return user.address !== config.default_address;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
