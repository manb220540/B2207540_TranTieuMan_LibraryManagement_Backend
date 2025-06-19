// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');
const transporter = require('../config/email');

// Register new reader
exports.register = async (req, res) => {
  try {
    const { MaDocGia, HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai, Email, Password } = req.body;
    const verificationToken = jwt.sign({ Email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const docGia = new DocGia({
      MaDocGia, HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai, Email, Password, VerificationToken,
    });
    await docGia.save();

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: Email,
      subject: 'Verify Your Account',
      html: `<p>Please verify your account by clicking <a href="http://localhost:8080/verify/${verificationToken}">here</a>.</p>`,
    });

    res.status(201).json({ message: 'Reader registered. Please verify your email.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { Email } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    await DocGia.updateOne({ Email }, { Verified: true, VerificationToken: null });
    res.json({ message: 'Email verified' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Login for readers and employees
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    let user = await DocGia.findOne({ Email }) || await NhanVien.findOne({ Email });
    if (!user || !await user.comparePassword(Password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.Verified === false && user instanceof DocGia) {
      return res.status(401).json({ message: 'Please verify your email' });
    }
    const role = user instanceof DocGia ? 'reader' : 'employee';
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};