const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");

const deleteFund = async (req, res) => {
  const transactionId = req.params.transaction_id;
  const deleteFundQuery = `DELETE FROM ${db}.addFunds WHERE transaction_id = ?`;
  try {
    await pool.query(deleteFundQuery, [transactionId]);
  } catch (error) {
    console.log("Error", error);
  }

};

module.exports = deleteFund;
