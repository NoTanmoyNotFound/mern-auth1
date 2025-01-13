import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// const TOKEN = process.env.MAILTRAP_TOKEN ;

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Tanmoy Das",
};
// const recipients = [
//   {
//     email: "tanmoydas78416@gmail.com",
//   }
// ];

//clinet API
// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error); 