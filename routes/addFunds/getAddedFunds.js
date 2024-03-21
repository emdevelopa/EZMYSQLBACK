const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");

const getAddedFunds = async (req, res) => {
  try {
    const fundsQuery = `SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') AS formatted_date FROM ${db}.addFunds`;

    const [fundsData] = await pool.query(fundsQuery);

    // console.log(fundsData);
    res.json({ funds: fundsData });
  } catch (error) {
    console.log("Error fetching Funds: ", error);
  }
};

module.exports = getAddedFunds;
