const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");
const moment = require("moment");
const uuid = require("uuid");
const sendDepositMail = require("../../mailsender/depositMail/depositMail");
const smtpConfig = require("../../mailsender/smtpConfig");

const addFunds = async (req, res) => {
  const { amountInUsd, btcamount, userId } = req.body;
  const date = moment().format("YYYY-MM-DD HH:mm:ss");
  let status = "pending";
  let paymentMode = "CRYPTO(BTC)";

  const transactionId = uuid.v4();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${db}.addFunds (
      transaction_id CHAR(36) PRIMARY KEY,
      wallet_id CHAR(36),
      client_name VARCHAR(200),
      btc_amount DOUBLE,
      usd_amount VARCHAR(20),
      date DATETIME,
      payment_mode VARCHAR(20),
      status VARCHAR(20)
    )
  `);

  const [result] = await pool.query(
    `SELECT * FROM ${db}.users WHERE id = ?`,
    [userId]
  );

  let clientName = result[0].name;
  let ClientEmail = result[0].email;

  await pool.query(
    `INSERT INTO ${db}.addFunds (transaction_id, wallet_id, client_name, btc_amount,usd_amount, date, payment_mode, status) VALUES (?, ?, ?,?, ?, ?, ?, ?)`,
    [
      transactionId,
      userId,
      clientName,
      btcamount,
      amountInUsd,
      date,
      paymentMode,
      status,
    ]
  );

  let adminEmail = "ezhedgef@gmail.com";

  const results = await sendDepositMail(
    smtpConfig,
    clientName,
    userId,
    ClientEmail,
    adminEmail,
    amountInUsd
  );
  console.log(results);
  if (results[0].sentMail) {
    res.status(200).json({
      message: "notification sent to admin mail",
      sent: results[0].sentMail,
    });
  } else {
    res
      .status(503)
      .json({ message: "failed to send mail", sent: results[0].error });
  }
};

module.exports = addFunds;
