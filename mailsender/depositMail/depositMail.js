// sendVerificationLink.js
const nodemailer = require("nodemailer");

const URL = process.env.HOMEURL;

async function sendDepositMail(
  smtpConfigs,
  clientName,
  userId,
  userEmail,
  adminEmail,
  amountInUsd
) {
  const sendEmail = async (smtpConfig, template, email) => {
    const transporter = nodemailer.createTransport({
      // service: smtpConfig.service, //DEVELOPMENT
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
      subject: "Transaction",
      html:template,
      text: "Nice day with you",
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      return { sentMail: true };
    } catch (error) {
      console.error("Email sending failed:", error);
      return { sentMail: false, error };
    }
  };

  const templateAdmin =  `<html>
                <body style="padding: 2em;display: flex;justify-content: center;align-items: center;">
                  <section style="font-family: Verdana, Geneva, Tahoma, sans-serif;text-align: left;">
                    <div>
                      <img src="https://lh3.googleusercontent.com/fife/ALs6j_FCL8lFke2Zm-CfFNIBR1WAEdFDpkeb8dGbUyQEfBprrjOX_x7SpnTirrJ5nWPP8b3Mu_JXGUpHc9qSA0KUzR5kf6wNTyPeMagBT-tOvJXIjXGdqS4iXtlmt1m8rvew_qULdJVxxoSE5EwlPBOnQW9aKNOX1sGUtUlmCypwW2QS-9GxjLd2SEiYNbBMQNWqONnDmJ1QEsQlXXGN8Iq6jY1B3pBxtB4FYaHvwKSsUWL8tNydgNU98-0E6Yswi-VXDjp9J11N-xujrJt1pBgRE4aEd3fRbAf0T3VDyNpqHo2d02DLvfCxogc3yckrBE0ubgeJ40AzMNw9bdITugG4ryYxhZA06qjAnzRyhvdt0MYHxT5DqvMzGpgdVQdVs_IX4JWaPZqU29Ll26UcSdc8mmEXlRqWibBonr2L-UjlTbD7JOtkUZ9qbEiKjy0Fohc0w4iYRT5c9WaYcTGJcF6SNCuvjz3-2AllYPJWZkKzdyz_I0yvU2imb1FjPp9jWwBPa1qIfSaSNrkrpwMT7D4ChLlv4UkhDRbnN-QAsoySZVwYXxSaPJ4WleUZ-DPEfIAUFkFl67w97HbcMIVqTFxQlfALQJFwLHu7ZrbJgqG1-aAAC6N8rmiTgEJ-DTHN-SjzviexiOzMOcPGAgJHNJyERbh0pAeSo7Aa3YZUh-9Rl4IohN7W-seldjx_3m_dSnQljc7uyD7-0EK33TO_0lcerPHgXgxbGd4jUXjlviOcBvBn5EuaInNxBF1sJ0IbokrfPWOOrip1yyeSU3PNYRv8ApMDxj2TDbl7drw1jORqTw5481jQmv58ciz1POMN_Qc4iOTZv2HCqBvElQmHgGEj2CMrg9WYerg-J7ng6u1z5cCOD3hyh-rQ8hVEfqgGTYn7PCNtSTZ8VlL2hMICzNWJRwDiETtXbynrXS8EKVnXiToZiZZTKGzWMEgSBJWXHYWTuMNvctNY28HOTi7YyPEedE_fvUsoTXtmtJ60RZj5-ohw8lARc0aGlaA-QzTf_JJoxHISer62k-VkjAwE7Hxt1yha2evdwB-qkCWeypkKoIjqXwP32wjvsU_9aZW2AozN3u271UCgHiNj_B57zB6xpB87RRaGK9z4lr19knWri69wUXb4hzuWfvTCJ2msf0_tICRYPr97gEF9mue4B-kDZCuHgufKnKczUAeu6Kwr8ZSdsnH8kgZZlLgNlcBAVc7vV__vE1-Q6uHzNAr7Tz6wpYVgO_dNMnS0GZwTxJ82iNGzVwwSlAMEzyFuNwOQc9YV3-nJsHh4paoZAExOie0Ym9UeQXSj7Tx_K8_0WCJNAYAFFF2s17wyMNRVo0bbtoiVC4xxVaLYCKOtlMOJFVv2rIELZcd3LFDP0TcgIUoCaxbtqyVbv09wnmg0WvwQbhn4cFzvs5lZPOtLHPhdyzU3m2hY1hPUMChirB9guvo-BtBAzrLacjFPhgQv-Lr0z8pomcF-_WZOLSZ3B5bCkUHD5OS0eykJFdN8H7Y5vGU8LOZ6crIrFgfbC-LarEzMkqXylJ_qZxH61EGfg0t77G4JlTl5EF2UOTYo-fsFdsk5Oa1wyKB8QO5KqIx49HtGgPgih_7qpidUaRektAo=s220?authuser=0" alt="logo">
                    </div>
                    <p style="font-size: 36px;">Confirm transaction</p>

                    <p>${clientName}</p>
                    <p>${userId}</p>
                 
                    <p>$${amountInUsd}</p>

            
                  </section>
                </body>
              </html>`

  const templateUser = `<html>
                <body style="padding: 2em;display: flex;justify-content: center;align-items: center;">
                  <section style="font-family: Verdana, Geneva, Tahoma, sans-serif;text-align: left;">
                   
                    <p style="font-size: 36px;">Confirm transaction</p>

                    <p>${clientName}</p>
                    <p>${userId}</p>
                 
                    <p>$${amountInUsd}</p>

            
                  </section>
                </body>
              </html>`;

  const results = await Promise.all([
    sendEmail(smtpConfigs, templateUser, userEmail),
    sendEmail(smtpConfigs, templateAdmin, adminEmail),
  ]);
  return results;
}

// toSend([smtpConfig]);
module.exports = sendDepositMail;
