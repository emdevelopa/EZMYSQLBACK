// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OAuthPassport = require("./Oauth/app");
const { startApp } = require("./db/database");
const userRoutes = require("./routes/user");
const oauthRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

OAuthPassport(app);

app.get("/another-route", (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    const loggedIn = req.session.loggedIn;
    res.send({
      loggedIn,
      user,
      userProperty: req.session.user,
    });
  } else
    res.send({
      loggedIn: false,
    });
});

app.get("/api/login", (req, res) => {
  console.log(req.session);
  console.log(req.cookies);

  console.log(req.session.user);
  if (req.session.user) {
    res.send({
      loggedIn: true,
      user: req.session.user,
      userProperty: req.session.user,
    });
  } else {
    res.send({ loggedIn: false });
  }
});

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
