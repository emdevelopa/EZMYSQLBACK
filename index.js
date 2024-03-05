// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const { startApp } = require("./db/database");
const OAuthPassport = require("./Oauth/app");
const oauthRoutes = require("./routes/auth");
const toSend = require("./verifymail/mail");
const smtpConfig = require("./verifymail/smtpConfig");
const SimpleCrypto = require("simple-crypto-js").default;

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

app.post("/submit", (req, res) => {
  console.log(req.body);
});
app.post("/send-message", async (req, res) => {
  console.log(req.body);
  const { name, email, telephone, password } = req.body;

    const secretKey = SimpleCrypto.generateRandom();

    // Create a SimpleCrypto instance
    const simpleCrypto = new SimpleCrypto(secretKey);

    // Encrypt the object
    const encryptedData = simpleCrypto.encrypt(req.body);

    console.log("Encrypted Data:", encryptedData);
    const decipherText = simpleCrypto.decrypt(encryptedData);
    console.log(decipherText);
  const results = await toSend([smtpConfig], name, email, {encryptedData, secretKey});

  if (results[0].sentMail) {
    res.status(200).json({ message: "verification link sent to email" });

  } else {
    res.status(503).json({ message: "failed to send mail" });
  }
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
