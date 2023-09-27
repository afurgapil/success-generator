/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const userRouter = require("./routes/userRouter");
const studentRouter = require("./routes/studentRouter");
const nodemailer = require("nodemailer");
app.use(express.json());
app.use(cors());
dotenv.config();
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
app.use("/user", userRouter);
app.use("/student", studentRouter);

app.post("/get-info", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const mailOptions = {
      from: "apicookbook@gmail.com",
      to: userEmail,
      subject: "About Success Generator",
      html: `<p>Hi!,</p>
      <p>time beneath met went why nothing grandfather area oil wear test particular pilot paint toward package press pet hold great hole keep shorter see</p>
      <p>Have a nice day!<br>Success Generator</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        res.status(500).json({ message: "Error sending email:" });
      } else {
        console.log("Email was sent successfully:", info.response);
        res.status(200).json({
          message: "The email was sent successfully. Check your mailbox",
        });
      }
    });
  } catch (err) {
    console.log("An error occurred:", err);
    res.status(500).json({ message: "An error occurred, please try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The server is running on port ${port}.`);
});
