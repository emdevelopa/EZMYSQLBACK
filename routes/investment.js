const { pool } = require("../db/database");
const uuid = require("uuid");
const moment = require("moment");

const invest = async (req, res) => {
  const { userId, amount } = req.body;

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

  const [walletResult] = await pool.query(
    "SELECT * FROM  ezHedgeFunds.wallet WHERE wallet_id = ?",
    [userId]
  );
 
  if (walletResult[0].wallet_balance <= 0) {
    res.status(403).send({ message: "insufficient balance" });
  }
  // Insert the investment record into the database
  else {
    try {
      // Deduct the investment amount from the wallet balance
      const deductAmountQuery =
        "UPDATE ezHedgeFunds.wallet SET wallet_balance = wallet_balance - ?, investment_in_progress = 1 WHERE wallet_id = ?";
      await pool.query(deductAmountQuery, [amount, walletId]);

      await pool.query(
        "INSERT INTO ezHedgeFunds.investments (investment_id, wallet_id, amount, start_date, end_date, status, start, end, amount_in_return, roi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          "UPDATE ezHedgeFunds.investments SET amount_in_return = ?, roi = ?, start = ? WHERE investment_id = ?",
          [amountInReturn, roi, start, investmentId]
        );

        // Increment the amountInReturn for each second based on the 8% return

        // Increment the start value every second
        start++;

        // Check if the investment has reached its end time
        console.log(start);
        if (start === end) {
          // Update the end time and status in the database
          await pool.query(
            "UPDATE ezhedgef_ezHedgeFunds.investments SET status = ? WHERE investment_id = ?",
            ["completed", investmentId]
          );

          const updateWalletQuery =
            "UPDATE ezHedgeFunds.wallet SET investment_in_progress = ? WHERE wallet_id = ?";
          await pool.query(updateWalletQuery, [0, walletId]);

          // Clear the interval and stop the investment calculation
          clearInterval(interval);
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
