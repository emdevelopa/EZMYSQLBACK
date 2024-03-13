const { pool } = require("../db/database");
const db = require("../db/getCurrrentDB");

const investments = async (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    const [getInvestments] = await pool.query(
      `SELECT * FROM ${db}.investments WHERE wallet_id = ? AND status='active'`,
      [userId]
    );
    // console.log();
    res.json({ investments: getInvestments[0] });
  }
};

module.exports = investments;
