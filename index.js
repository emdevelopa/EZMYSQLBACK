// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OAuthPassport = require("./Oauth/app");
const { startApp } = require("./db/database");
const userRoutes = require("./routes/user");
const oauthRoutes = require("./routes/auth");


const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

OAuthPassport(app);
// Routes
app.get("/", (req, res) => {
  res.send("Server is up and running");
});

// app.post("/submit", (req, res) => {
//   console.log(req.body);
// });
// app.post("/send-message", );

app.use("/auth", oauthRoutes.authGoogle);
app.use("/es", oauthRoutes.already);
app.use("/dashboard", oauthRoutes.dashboard);
app.use("/", userRoutes.user);

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
