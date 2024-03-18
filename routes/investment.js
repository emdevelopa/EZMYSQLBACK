const { pool } = require("../db/database");
const uuid = require("uuid");
const moment = require("moment");
const db = require("../db/getCurrrentDB");

const invest = async (req, res) => {
  const { userId, amount } = req.body;

  console.log("Received request with userId:", userId);

  // Set investment parameters
  const investmentId = uuid.v4();
  const walletId = userId; // Assuming walletId is the same as userId
  const startDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const endDate = moment().add(30, "seconds").format("YYYY-MM-DD HH:mm:ss");
  let status = "active"; // You may adjust this based on your requirements
  let start = 0;
  let end = 30;
  let amountInReturn = 0;
  let roi = 0;

  console.log("Creating investments table if not exists...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${db}.investments (
      investment_id CHAR(36) PRIMARY KEY,
      wallet_id CHAR(36),
      amount DECIMAL(10, 2),
      start_date DATE,
      end_date DATE,
      status VARCHAR(20),
      start INT,
      end INT,
      amount_in_return DECIMAL(10, 2),
      roi DECIMAL(5, 2),
      FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id)
    )
  `);

  console.log("Checking wallet balance...");
  const [walletResult] = await pool.query(
    `SELECT * FROM  ${db}.wallets WHERE wallet_id = ?`,
    [userId]
  );

  if (walletResult[0].wallet_balance <= 0) {
    console.log("Insufficient balance, sending response...");
    res.status(403).send({ message: "Insufficient balance" });
  } else {
    // Insert the investment record into the database
    try {
      console.log("Deducting amount from wallet balance...");
      const deductAmountQuery = `UPDATE ${db}.wallets SET wallet_balance = wallet_balance - ?, investment_in_progress = 1 WHERE wallet_id = ?`;
      await pool.query(deductAmountQuery, [amount, walletId]);

      console.log("Inserting investment record into database...");
      await pool.query(
        `INSERT INTO ${db}.investments (investment_id, wallet_id, amount, start_date, end_date, status, start, end, amount_in_return, roi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          investmentId,
          walletId,
          amount,
          startDate,
          endDate,
          status,
          start,
          end,
          amountInReturn,
          roi,
        ]
      );

      console.log("Starting investment calculation loop...");
      const y = amount * 0.08;
      amountInReturn = amount + y;
      const daily = 0.08 / 30;
      const daily2 = amount * daily;
      // Start the investment calculation loop
      const interval = setInterval(async () => {
        // Calculate ROI for each second
        roi += daily2;

        // Update the database with the new start and ROI values
        await pool.query(
          `UPDATE ${db}.investments SET amount_in_return = ?, roi = ?, start = ? WHERE investment_id = ?`,
          [amountInReturn, roi, start, investmentId]
        );

        // Increment the start value every second
        start++;

        // Check if the investment has reached its end time
        console.log("Current start value:", start);
        if (start === end) {
          // Update the end time and status in the database
          await pool.query(
            `UPDATE ${db}.investments SET status = ? WHERE investment_id = ?`,
            ["completed", investmentId]
          );

          const updateWalletQuery = `UPDATE ${db}.wallets SET investment_in_progress = ? WHERE wallet_id = ?`;
          await pool.query(updateWalletQuery, [0, walletId]);

          // Clear the interval and stop the investment calculation
          clearInterval(interval);
          console.log("Investment completed.");
        }
      }, 1000);

      res
        .status(200)
        .json({ success: true, message: "Investment started successfully." });
    } catch (error) {
      console.error("Error during investment:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
};

module.exports = invest;
