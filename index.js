// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OAuthPassport = require("./Oauth/app");
const { startApp } = require("./db/database");
const userRoutes = require("./routes/user");
const oauthRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const loginSession = require("./routes/loginsession");
const getUserData = require("./routes/getUserData");
const session = require("express-session");

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

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 3600000, // Session timeout in milliseconds (1 hour in this example)
    },
    name: "sessionId", // Change the default session ID cookie name
  })
);

OAuthPassport(app);

app.use("/auth", oauthRoutes.authGoogle);
app.use("/es", oauthRoutes.already);
app.use("/dashboard", oauthRoutes.dashboard);
app.use("/", userRoutes.user);
app.use("/login-session", loginSession);
app.use("/get-userData/:userId", getUserData);

app.post("/invest", (req, res) => {
  const { userId, amount } = req.body;
  console.log(req.body);
  console.log(amount, userId);
  res.send({ status: 200 });
});

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
