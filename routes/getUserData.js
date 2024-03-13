const { pool } = require("../db/database");
const db = require("../db/getCurrrentDB");


const getUserData = async (req, res) => {
  const userId = req.params.userId;
  // Now you can use userId in your backend logic
  if (userId) {
    try {
      const userQuery = `SELECT * FROM ${db}.users WHERE id=?`;
      const walletQuery = `SELECT * FROM ${db}.wallet WHERE wallet_id =?`;

      const [userData] = await pool.query(userQuery, [userId]);
      const [walletData] = await pool.query(walletQuery, [userId]);

      if (userData.length > 0 && walletData.length > 0) {
        res.json({ user: userData[0], wallet: walletData[0] });
      } else {
        res.status(404).json({ error: "User or wallet not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Invalid userId" });
  }
};

module.exports = getUserData;
