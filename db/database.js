// database.js
const mysql = require("mysql2/promise");
require("dotenv").config();

// database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
};

const pool = mysql.createPool(dbConfig);

// Create a connection pool
const createPool = async () => {
  try {
    // Test the connection
    await pool.query("SELECT 1");
    console.log("Database connection successful!");
    return pool;
  } catch (err) {
    console.error("Error creating connection pool:", err);
    throw err;
  }
};

//Starts server
const startApp = async (app) => {
  try {
    await createPool();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error starting the app:", err);
    process.exit(1);
  }
};

module.exports = {
  createPool,
  pool,
  startApp,
};
