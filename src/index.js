const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const express = require("express");
require("dotenv").config();
let server=express();
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port

// make connection to DB
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log("Connection successful");
  })
  .catch((e) => console.log(e));

  


