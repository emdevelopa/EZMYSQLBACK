const express = require("express");
const {
  createUser,
  userLogin,
  sendVerificationLink,
} = require("./functions/user");
const user = express.Router();

user.post("/register", createUser);
user.post("/login", userLogin);
user.post("/send-message", sendVerificationLink);

module.exports = {
  user,
};
