import nodemailer from "nodemailer";
import clientActivationTemplate from "./templates/emailTemplates.js";
import * as dotenv from 'dotenv';
dotenv.config();

class Mail {
  static transporter() {
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

  static send({ to, subject, body}) {
    this.transporter().sendMail(this.mailer({to: to, subject: subject, body}), (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}

export default Mail;
