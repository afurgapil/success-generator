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
  service: "Gmail",
  auth: {
    user: "apicookbook@gmail.com",
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
        console.log("E-posta gönderilirken hata oluştu:", error);
        res.status(500).json({ message: "zortladik" });
      } else {
        console.log("E-posta başarıyla gönderildi:", info.response);
        res.status(200).json({
          message: "E-posta başarıyla gönderildi.Mail kutunuzu kontrol ediniz",
        });
      }
    });
  } catch (err) {
    console.log("Hata oluştu:", err);
    res
      .status(500)
      .json({ message: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});
