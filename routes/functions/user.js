const { pool } = require("../../db/database");
const uuid = require("uuid");
const toSend = require("../../verifymail/mail");
const smtpConfig = require("../../verifymail/smtpConfig");
const crypto = require("crypto");
const db = require("../../db/getCurrrentDB");

const algorithm = "aes-256-cbc";
const key = "abcdefghijklmnopqrstuvwxyz123456";
const iv = crypto.randomBytes(16);

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decrypt(iv, encryptedData) {
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(Buffer.from(encryptedData, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
// Register User
const createUser = async (req, res) => {
  try {
    // const { enc } = req.body;
    const enc = req.query.enc;

    const encryptedData = JSON.parse(decodeURIComponent(enc));
    const decryptedData = decrypt(
      encryptedData.iv,
      encryptedData.encryptedData
    );
    console.log("Decrypted data:", JSON.parse(decryptedData));

    const userData = JSON.parse(decryptedData);

    const { fullname, email, telephone, password } = userData;

    const userId = uuid.v4(); // Generate UUID for user ID

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${db}.users (
          id varchar(255) NOT NULL,
          name varchar(250) NOT NULL,
          email varchar(250) NOT NULL,
          telephone varchar(250) NOT NULL,
          password varchar(250) NOT NULL,
          PRIMARY KEY (id)
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS ${db}.wallets (
          wallet_id CHAR(36) PRIMARY KEY,
          wallet_balance DECIMAL(10, 2),
          investment_in_progress BOOLEAN
        )
    `);

    // Insert user into the 'users' table
    await pool.query(
      `INSERT INTO ${db}.users (id, name, email, telephone, password) VALUES (?, ?, ?, ?, ?)`,
      [userId, fullname, email, telephone, password]
    );

    // Insert wallet for the user
    await pool.query(
      `INSERT INTO ${db}.wallets (wallet_id, wallet_balance, investment_in_progress) VALUES (?,?,?)`,
      [userId, 10000, false]
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

// User Log-in
const userLogin = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const [result] = await pool.query(
      `SELECT * FROM ${db}.users WHERE email=? AND password=?`,
      [email, password]
    );

    if (result.length <= 0) {
      res.status(404).json({ message: "email or password not found" });
      console.log("no user found");
    } else {
      // const secretKey = SimpleCrypto.generateRandom();
      // const simpleCrypto = new SimpleCrypto(secretKey);
      // const encryptedData = simpleCrypto.encrypt(result[0]);

      // Set session properties

      req.session.user = result[0].id;
      req.session.loggedIn = true;
      // console.log(req.session);

      res.status(201).json({ message: "user found", userInfo: result[0] });
    }
  } catch (error) {
    console.log(error);
  }
};

// send Link to Email
const sendVerificationLink = async (req, res) => {
  const { fullname, email, telephone, password, confirm_password } = req.body;
  const encryptedData = encrypt(JSON.stringify(req.body));
  console.log(encryptedData);

  const results = await toSend([smtpConfig], fullname, email, encryptedData);
  console.log(results);
  if (results[0].sentMail) {
    res.status(200).json({
      message: "verification link sent to email",
      sent: results[0].sentMail,
    });
  } else {
    res
      .status(503)
      .json({ message: "failed to send mail", sent: results[0].error });
  }
};

module.exports = { createUser, userLogin, sendVerificationLink };
