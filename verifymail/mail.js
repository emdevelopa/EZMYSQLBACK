// sendVerificationLink.js
const nodemailer = require("nodemailer");

const URL = process.env.HOMEURL;

async function toSend(smtpConfigs, username, email, encryptedData) {
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
    // console.log(formdata);
    const mailOptions = {
      from: "no-reply@ezhedgefunds.com",
      to: email,
      subject: "This is meeting you well",
      html: `<html>
                <body style="padding: 2em;display: flex;justify-content: center;align-items: center;">
                  <section style="font-family: Verdana, Geneva, Tahoma, sans-serif;text-align: left;">
                    <div>
                      <img src="https://drive.google.com/thumbnail?id=1-kbfjtQNPfPeuP_wAaSXicIosywyUUEy" alt="logo">
                    </div>
                    <p style="font-size: 36px;">Verify your email address</p>

                    <p>Hi ${username}</p>

                    <p>Please confirm that you want to use your email address with ezhedgefunds account. If you did not signup withthis email address, then feel free to ignore this email</p>
                    <a href="${URL}/verifyAccount.html?enc=${encodeURIComponent(
        JSON.stringify(encryptedData)
      )}"><button style="background-color: black;color: white;border: none; padding: 1em;border-radius: 5px;">Verifyemail address</button></a>
                    <p>Regards,</p>
                    <p>The ezhedgefunds Team</p>
                  </section>
                </body>
              </html>`,
      text: "Nice day with you",
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      return { sentMail: true };
    } catch (error) {
      console.error("Email sending failed:", error);
      return { sentMail: false };
    }
  };

  const results = await Promise.all(smtpConfigs.map(sendEmail));
  return results;
}

// toSend([smtpConfig]);
module.exports = toSend;
