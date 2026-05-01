require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: `Message from ${name}`,
      text: message
    };

    await transporter.sendMail(mailOptions);

    res.send("Message sent successfully!");
  } catch (err) {
    res.send("Error sending message");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));