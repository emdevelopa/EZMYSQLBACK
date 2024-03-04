// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const { createPool, startApp } = require("./db/database");
const session = require("express-session");
const passport = require("passport");
const pass = require("./Oauth/app");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const oauthRoutes = require("./Oauth/routes/auth");
const toSend = require("./verifymail/mail");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

pass(app);
// Routes
app.get("/", (req, res) => {
  res.send("Server is up and running");
});
const smtpConfig = {
  host: "vda4300.is.cc",
  port: 587,
  // secure: true,
  auth: {
    user: "ezhedgef@ezhedgefunds.com",
    pass: "ZrzLu2W2",
  },
};
app.post("/submit", (req, res) => {
  console.log(req.body);
});
app.post("/send-message", (req, res) => {
  console.log(req.body);
  toSend([smtpConfig]);
});

app.use("/auth", oauthRoutes.authGoogle);
app.use("/es", oauthRoutes.already);
app.use("/dashboard", oauthRoutes.dashboard);
app.use("/user", userRoutes.user);

// Start the server
startApp(app);
// const smtpConfig = {
//   service: "gmail",
//   host: "smtp.elasticemail.com",
//   port: 2525,
//   secure: true,
//   auth: {
//     user: "gyimahemwurld@gmail.com",
//     pass: "crqv tjtv pwpw xnlw",
//   },
// };
