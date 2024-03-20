const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");
const moment = require("moment");
const uuid = require("uuid");

const addFunds = async (req, res) => {
  const { btcamount, userId } = req.body;
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
      date DATETIME,
      payment_mode VARCHAR(20),
      status VARCHAR(20)
    )
  `);

  const [result] = await pool.query(
    `SELECT name FROM ${db}.users WHERE id = ?`,
    [userId]
  );
  console.log(result[0].name);
  let clientName = result[0].name;

  await pool.query(
    `INSERT INTO ${db}.addFunds (transaction_id, wallet_id, client_name, btc_amount, date, payment_mode, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [transactionId, userId, clientName, btcamount, date, paymentMode, status]
  );
};

module.exports = addFunds;
