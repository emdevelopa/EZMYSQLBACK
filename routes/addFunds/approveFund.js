const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");

const approveFund = async (req, res) => {
  const transactionId = req.params.transaction_id;
  const { wallet_id, amount_usd } = req.body;

  console.log(wallet_id, amount_usd);

  const updateFundQuery = `UPDATE ${db}.addFunds SET status = ? WHERE transaction_id = ? `;
  const updateWalletQuery = `UPDATE ${db}.wallets SET wallet_balance = wallet_balance + ? WHERE wallet_id = ?`;

  await pool.query(updateFundQuery, ["approved", transactionId]);
  await pool.query(updateWalletQuery, [amount_usd, wallet_id]);
};

module.exports = approveFund;
