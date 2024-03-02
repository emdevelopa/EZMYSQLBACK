// database.js
const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "ezHedgeFunds",
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
