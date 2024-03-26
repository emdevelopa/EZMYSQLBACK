const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");

const getAddedFundsForUsers = async (req, res) => {
  const walletId = req.params.wallet_id;
  // console.log(walletId);
  try {
    const userfundsQuery = `SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') AS formatted_date FROM ${db}.addFunds WHERE wallet_id =?`;
    const [userfundsData] = await pool.query(userfundsQuery, [walletId]);
    // console.log(userfundsData);

    // console.log(fundsData);
    res.json({ funds: userfundsData });
  } catch (error) {
    console.log("Error fetching Funds: ", error);
  }
};

const getAddedFundsForAdmin = async (req, res) => {
  try {
    const fundsQuery = `SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') AS formatted_date FROM ${db}.addFunds`;

    const [fundsData] = await pool.query(fundsQuery);

    // console.log(fundsData);
    res.json({ funds: fundsData });
  } catch (error) {
    console.log("Error fetching Funds: ", error);
  }
};

module.exports = { getAddedFundsForAdmin, getAddedFundsForUsers };
