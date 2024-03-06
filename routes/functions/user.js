const { pool } = require("../../db/database");
const uuid = require("uuid");
const toSend = require("../../verifymail/mail");
const smtpConfig = require("../../verifymail/smtpConfig");
const SimpleCrypto = require("simple-crypto-js").default;
const session = require("express-session");

// Register User
const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { key, enc } = req.body;
    const simpleCrypto = new SimpleCrypto(key);
    const decipherData = simpleCrypto.decrypt(enc);
    console.log(decipherData);
    const { name, email, telephone, password } = decipherData;
    const userId = uuid.v4(); // Generate UUID for user ID

    // Insert user into the 'users' table
    await pool.query(
      "INSERT INTO users (id, name, email, telephone, password) VALUES (?, ?, ?, ?, ?)",
      [userId, name, email, telephone, password]
    );

    // Insert wallet for the user
    await pool.query(
      "INSERT INTO wallet (wallet_id, wallet_balance, investment_in_progress) VALUES (?,?,?)",
      [userId, 0, false]
    );

    // Return user data with generated ID
    const userData = {
      id: userId,
      name,
      email,
      telephone,
      password,
    };

    res
      .status(201)
      .json({ message: "User created successfully", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// User Log-in
const userLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const [result] = await pool.query(
      "SELECT * FROM users WHERE email=? AND password=?",
      [email, password]
    );

    if (result.length <= 0) {
      res.status(404).json({ message: "Email does not exist" });
      console.log("no user found");
    } else {
      const secretKey = SimpleCrypto.generateRandom();
      const simpleCrypto = new SimpleCrypto(secretKey);
      const encryptedData = simpleCrypto.encrypt(result[0]);

      // Set session properties

      req.session.user = "result";
      req.session.loggedIn = true;
      res.send({
        loggedIn: true,
        user: req.session.user,
        userProperty: req.session.user,
      });
      // console.log(req.session);
   
      // res.cookie("myCookie", "cookieValue", {
      //   maxAge: 3600000,
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "strict",
      // });

      // res
      //   .status(201)
      //   .json({ message: "user found", encryptedData, id: result[0].id });
      // console.log(result[0]);
    }
  } catch (error) {
    console.log(error);
  }
};

// send Link to Email
const sendVerificationLink = async (req, res) => {
  const { name, email } = req.body;
  const secretKey = SimpleCrypto.generateRandom();
  // Create a SimpleCrypto instance
  const simpleCrypto = new SimpleCrypto(secretKey);
  // Encrypt the object
  const encryptedData = simpleCrypto.encrypt(req.body);
  const results = await toSend([smtpConfig], name, email, {
    encryptedData,
    secretKey,
  });
  if (results[0].sentMail) {
    res.status(200).json({ message: "verification link sent to email" });
  } else {
    res.status(503).json({ message: "failed to send mail" });
  }
};

module.exports = { createUser, userLogin, sendVerificationLink };
