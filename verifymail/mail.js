// sendVerificationLink.js

const nodemailer = require("nodemailer");

async function toSend(smtpConfigs) {
  const sendEmail = async (smtpConfig) => {
    const transporter = nodemailer.createTransport({
      service: smtpConfig.service,
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
    });

    const mailOptions = {
      from: "no-reply@ezhedgefunds.com",
      to: "gyimahemwurld@gmail.com",
      subject: "This is meeting you well",
      html: `<html><body style="padding: 4em;">
    <section style="font-family: Verdana, Geneva, Tahoma, sans-serif;text-align: left;width:70%;">
        <div>
            <img src="./logo.jpeg" alt="logo">
        </div>
        <p style="font-size: 36px;">Verify your email address</p>

        <p>Hi Gyimah</p>

        <p>Please confirm that you want to use your email address with ezhedgefunds account. If you did not request this change, then feel free to ignore this email</p>

        <button style="background-color: black;color: white;border: none; padding: 1em;border-radius: 5px;">Verify new email address</button>

        <p>Regards,</p>
        <p>The ezhedgefunds Team</p>
    </section>
</body></html>`,
      text: "Nice day with you",
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };

  // Use Promise.all to send emails concurrently
  await Promise.all(smtpConfigs.map(sendEmail));
}

// toSend([smtpConfig]);
module.exports = toSend;
