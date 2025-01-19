import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

type TransporConfig = {
      host: string
      port: number
      auth: {
            user: string
            pass: string
      }
};

// Looking to send emails in production? Check out our Email API/SMTP product!
const config = (): TransporConfig => {
      return {
            host: process.env.EMAIL_HOST,
            port: +process.env.EMAIL_PORT,
            auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
            }
      }
};

export const transport = nodemailer.createTransport(config());