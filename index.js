// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OAuthPassport = require("./Oauth/app");
const { startApp } = require("./db/database");
const userRoutes = require("./routes/user");
const oauthRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const corsOptions = {
  origin: ["http://127.0.0.1:5501", "http://localhost:5500"], // Update with your actual client origin
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser("yourSecretKey"));
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true, // Set to true if needed
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

OAuthPassport(app);

app.post("/your-route", (req, res) => {
  req.session.user = "result";
  req.session.loggedIn = true;
  res.send('Login successful! <a href="/dashboard">Go to dashboard</a>');
  // other logic...
});

app.get("/another-route", (req, res) => {
  // Access the session data

  const user = req.session.user;
  const loggedIn = req.session.loggedIn;

  console.log("GET", { user: user, logged: loggedIn });
  res.send({ loggedIn });
  // other logic...
});

// Routes
app.get("/", (req, res) => {
  console.log(req.session);
  const user = req.session.user;
  const loggedIn = req.session.loggedIn;
  console.log(user, loggedIn);
  // if (req.session.page_views) {
  //   req.session.page_views++;
  //   res.send("You visited this page " + req.session.page_views + " times");
  // } else {
  //   req.session.page_views = 1;
  //   res.send("Welcome to this page for the first time!");
  // }

  if (req.session.page_views) {
    res.send({
      loggedIn: true,
      user: req.session.user,
      userProperty: req.session.user,
    });
  } else {
    req.session.page_views = 1;

    res.send({ loggedIn: false });
  }
  // res.send("Server is up and running");
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
