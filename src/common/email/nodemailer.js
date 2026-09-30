import {config} from 'dotenv';
config();
import nodemailer from "nodemailer";
const  trsporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
export const sendEmail = async (to , subject , text) => {

   await trsporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text
    });
}