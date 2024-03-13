const { pool } = require("../db/database");

const investments = async (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    const [getInvestments] = await pool.query(
      "SELECT * FROM ezHedgeFunds.investments WHERE wallet_id = ? AND status='active'",
      [userId]
    );
    // console.log();
    res.json({ investments: getInvestments[0] });
  }
};

module.exports = investments;
