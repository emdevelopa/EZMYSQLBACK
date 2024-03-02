// routes/user.js
const express = require("express");
const { pool } = require("../db/database");

const user = express.Router();
const details = {
  name: "john doe",
  email: "john@gmail.com",
  telephone: 9999,
  password: "1234",
};
const createUser = async (req, res) => {
  try {
    const { name, email, telephone, password } = details;
    const [result] = await pool.query(
      "INSERT INTO users (name, email, telephone, password) VALUES (?, ?, ?, ?)",
      [name, email, telephone, password]
    );
    res.status(201).json({ message: "User created successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

user.post("/", createUser);

module.exports = {
  user,
};
