// const { pool } = require("../db/database");
// const db = require("../db/getCurrrentDB");

// const investments = async (req, res) => {
//   const userId = req.params.userId;
//   if (userId) {
//     const [getInvestments] = await pool.query(
//       `SELECT * FROM ${db}.investments WHERE wallet_id = ? AND status='active'`,
//       [userId]
//     );
//     // console.log();
//     res.json({ investments: getInvestments[0] });
//   }
// };

// module.exports = investments;

const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");

const investments = async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId);
  if (userId) {
    try {
      const tableExistsQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'investments'`;
      const [tableExistsResult] = await pool.query(tableExistsQuery, [db]);

      if (tableExistsResult[0].count === 1) {
        const investmentsQuery = `SELECT * FROM ${db}.investments WHERE wallet_id = ? AND status='active'`;
        const [getInvestments] = await pool.query(investmentsQuery, [userId]);
        const AllInvestmentsQuery = `SELECT * FROM ${db}.investments WHERE wallet_id = ?`;
        const [getAllInvestments] = await pool.query(AllInvestmentsQuery, [
          userId,
        ]);

        res.json({ investments: getInvestments, history: getAllInvestments});
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

module.exports = investments;
