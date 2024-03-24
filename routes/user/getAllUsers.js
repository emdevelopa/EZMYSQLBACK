const { pool } = require("../../db/database");
const db = require("../../db/getCurrrentDB");

const getAllUsers = async (req, res) => {
  try {
    const getUsersQuery = `SELECT * FROM ${db}.users`;

    const [allUsers] = await pool.query(getUsersQuery);

    // console.log(allUsers);
    res.json(allUsers );
  } catch (error) {
    console.log("Error fetching Funds: ", error);
  }
};

module.exports = getAllUsers;
