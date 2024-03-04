const express = require("express");
const { pool } = require("../db/database");
const uuid = require("uuid");
const SimpleCrypto = require("simple-crypto-js").default;

const user = express.Router();
const details = {
  name: "john doe",
  email: "john@gmail.com",
  telephone: 9999,
  password: "1234",
};

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { key, enc } = req.body;

    const simpleCrypto = new SimpleCrypto(key);

    const decipherText = simpleCrypto.decrypt(enc);
    console.log(decipherText);
    // const userId = uuid.v4(); // Generate UUID for user ID

    // // Insert user into the 'users' table
    // await pool.query(
    //   "INSERT INTO users (id, name, email, telephone, password) VALUES (?, ?, ?, ?, ?)",
    //   [userId, name, email, telephone, password]
    // );

    // // Insert wallet for the user
    // await pool.query(
    //   "INSERT INTO wallet (wallet_id, wallet_balance, investment_in_progress) VALUES (?,?,?)",
    //   [userId, 0, false]
    // );

    // // Return user data with generated ID
    // const userData = {
    //   id: userId,
    //   name,
    //   email,
    //   telephone,
    //   password,
    // };

    // res
    //   .status(201)
    //   .json({ message: "User created successfully", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

user.post("/", createUser);

module.exports = {
  user,
};
