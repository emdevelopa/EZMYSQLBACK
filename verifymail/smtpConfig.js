require("dotenv").config();

const smtpConfig = {
  service:"gmail",
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

module.exports = smtpConfig;
