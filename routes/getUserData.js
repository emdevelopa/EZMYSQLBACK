const { pool } = require("../db/database");

const getUserData = async (req, res) => {
  const userId = req.params.userId;
  // Now you can use userId in your backend logic
  if (userId) {
    const [dataResult] = await pool.query(
      "SELECT * FROM ezHedgeFunds.users WHERE id=?",
      [userId]
    );
    if (dataResult) {
      const [walletResult] = await pool.query(
        "SELECT * FROM ezHedgeFunds.wallet WHERE wallet_id =?",
        [userId]
      );

      res.json({ user: dataResult[0], wallet: walletResult[0] });
    }
  }
  // console.log(userId);

  // ...
};

module.exports = getUserData;
