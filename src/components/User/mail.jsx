require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

  const otp = generateOTP();
  const expirationTime = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { otp, expirationTime };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mã OTP của bạn",
    text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP đã được gửi!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi gửi OTP", error });
  }
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Thiếu thông tin" });

  const storedOtpData = otpStore[email];
  if (!storedOtpData)
    return res.status(400).json({ message: "OTP không tồn tại" });

  if (Date.now() > storedOtpData.expirationTime) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP đã hết hạn" });
  }

  if (otp === storedOtpData.otp) {
    delete otpStore[email];
    return res.json({ message: "Xác nhận OTP thành công!" });
  } else {
    return res.status(400).json({ message: "OTP không hợp lệ" });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
