// backend/config/email.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for 465, `false` for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
};

// Function to send verification email
const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác nhận đổi mật khẩu - Thư viện PL',
    html: `
      <h3>Xin chào,</h3>
      <p>Chúng tôi đã nhận được yêu cầu đổi mật khẩu cho tài khoản của bạn. Dưới đây là mã xác nhận (OTP) để hoàn tất quá trình:</p>
      <h2 style="color: #0d6efd">${otp}</h2>
      <p>Vui lòng nhập mã này vào trang xác nhận để tiếp tục. Mã có hiệu lực trong 10 phút.</p>
      <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi.</p>
      <p>Trân trọng,<br>Đội ngũ Thư viện sách TM</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} with OTP ${otp}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = { transporter, generateOTP, sendVerificationEmail };