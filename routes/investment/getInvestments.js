// const { pool } = require("../db/database");
// const db = require("../db/getCurrrentDB");

const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");

const investmentsUsers = async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId);
  if (userId) {
    try {
      const tableExistsQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'investments'`;
      const [tableExistsResult] = await pool.query(tableExistsQuery, [db]);

      if (tableExistsResult[0].count === 1) {
        const investmentsQuery = `SELECT * FROM ${db}.investments WHERE wallet_id = ? AND status='active'`;
        const [getInvestments] = await pool.query(investmentsQuery, [userId]);
        const AllInvestmentsQuery = `SELECT *, DATE_FORMAT(start_date, '%Y-%m-%d %H:%i:%s') AS formatted_date FROM ${db}.investments WHERE wallet_id = ?`;
        const [getAllInvestments] = await pool.query(AllInvestmentsQuery, [
          userId,
        ]);

        res.json({ investments: getInvestments, history: getAllInvestments });
      } else {
        res.status(404).json({ error: "Investments table does not exist" });
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "User ID is missing" });
  }
};

const getInvestmentsAdmin = async (req, res) => {
  const [getActiveInvestments] = await pool.query(
    `SELECT * FROM ${db}.investments WHERE status='active'`
  );
  const AllInvestmentsQuery = `SELECT *, DATE_FORMAT(start_date, '%Y-%m-%d %H:%i:%s') AS formatted_date FROM ${db}.investments WHERE status='completed'`;
  const [getAllInvestments] = await pool.query(AllInvestmentsQuery);
  // console.log();
  res.json({
    active_investments: getActiveInvestments,
    completed_investments: getAllInvestments,
  });
};

module.exports = { investmentsUsers, getInvestmentsAdmin };
