import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
dotenv.config();

class Mail {
  transporter() {
    return nodemailer.createTransport({
      host: process.env.SERVICE,
      port: 2525,
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  static mailer({to, subject, body}) {
    return {
      from: process.env.EMAIL_ACCOUNT,
      to: to,
      subject: subject,
      html: body,
    };
  }

  static async send({ to, subject, body}) {
    await this.transporter().sendMail(this.mailer({to: to, subject: subject, body}),);
  }
}

export default Mail;
