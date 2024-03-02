// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const { createPool, startApp } = require("./db/database");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.use("/user", userRoutes.user);

// Start the server
startApp(app);
