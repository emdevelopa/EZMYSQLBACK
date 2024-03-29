// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OAuthPassport = require("./Oauth/app");
const { startApp } = require("./db/database");
const userRoutes = require("./routes/user/user");
const oauthRoutes = require("./routes/Oauth/auth");
const cookieParser = require("cookie-parser");
const loginSession = require("./routes/loginSession/loginsession");
const getUserData = require("./routes/user/getUserData");
const session = require("express-session");
const invest = require("./routes/investment/investment");
const investments = require("./routes/investment/getInvestments");
const db = require("./db/getCurrrentDB");
const addFunds = require("./routes/addFunds/addFunds");
const getAddedFunds = require("./routes/addFunds/getAddedFunds");
const approveFund = require("./routes/addFunds/approveFund");
const deleteFund = require("./routes/addFunds/deleteFund");
const getAllUsers = require("./routes/user/getAllUsers");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  origin: [
    process.env.USERDASHBOARDURL,
    process.env.HOMEURL,
    process.env.ADMINURL,
  ],
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

app.get("/", (req, res) => {
  res.send(`Server is up and running!, current db is ${db}`);
});

// Google Oauth
app.use("/auth", oauthRoutes.authGoogle);
app.use("/es", oauthRoutes.already);
app.use("/dashboard", oauthRoutes.dashboard);
// Login session
app.use("/login-session", loginSession);
// User
app.use("/", userRoutes.user);
app.use("/get-userData/:userId", getUserData);
app.use("/get-users", getAllUsers)
app.use("/get-deposits/:wallet_id", getAddedFunds.getAddedFundsForUsers);
// Investment
app.use("/get-investments/:userId", investments.investmentsUsers);
app.use("/get-investments", investments.getInvestmentsAdmin)
app.use("/invest", invest);
// Funding or deposits
app.use("/add-funds", addFunds);
app.use("/get-deposits", getAddedFunds.getAddedFundsForAdmin);
app.use("/approve-fund/:transaction_id", approveFund);
app.use("/delete-fund/:transaction_id", deleteFund);

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
