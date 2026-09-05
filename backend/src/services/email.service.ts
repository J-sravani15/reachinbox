import nodemailer from "nodemailer";

export const sendEmail = async (
  smtpHost: string,
  smtpPort: number,
  smtpUser: string,
  smtpPassword: string,
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};