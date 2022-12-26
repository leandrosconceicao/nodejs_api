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

  static mailer({ id, name, to, subject }) {
    return {
      from: process.env.EMAIL_ACCOUNT,
      to: to,
      subject: subject,
      html: clientActivationTemplate({id: id, name: name}),
    };
  }

  static send({ id, name, to, subject}) {
    this.transporter().sendMail(this.mailer({ id: id , name: name, to: to, subject: subject}), (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}

export default Mail;
