import nodemailer from "nodemailer";
import emailTemplate from "./emailTemplates.js";
import * as dotenv from 'dotenv';
dotenv.config();

class Mail {
  static transporter() {
    return nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  static mailer({ id, name, to }) {
    return {
      from: process.env.EMAIL_ACCOUNT,
      to: to,
      subject: "Confirmação de email",
      html: emailTemplate({id: id, name: name}),
    };
  }

  static send({ id, name, to}) {
    this.transporter().sendMail(this.mailer({ id: id , name: name, to: to}), (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}

export default Mail;
