import { createTransport } from "nodemailer";

// Initialize variables for nodemailer transporter and mail configuration
let transporter = null;
let MAIL = null;

/**
 * Initializes the nodemailer transporter with the provided mail configuration.
 * If the transporter is not already created, it uses the environment variables for mail and password.
 */
const init = () => {
  if (!transporter) {
    MAIL = process.env.MAIL;
    const mailConfig = {
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: MAIL,
        pass: process.env.MAIL_PASSWORD
      }
    };
    transporter = createTransport(mailConfig);
  }
}

/**
 * Object containing methods related to email functionality.
 */
export const mailer = {
  /**
   * Sends an email using the configured transporter.
   *
   * @param {Object} data - The email data including 'to', 'subject', 'text', 'html', etc.
   * @returns {Promise} A promise that resolves when the email is sent successfully.
   */
  sendMail: async data => {
    // Initialize the transporter if not already done
    init();

    // Use the transporter to send the email
    return await transporter.sendMail({
      from: MAIL,
      ...data
    });
  }
}
