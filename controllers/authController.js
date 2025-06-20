// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NhanVien = require('../models/NhanVien');
const DocGia = require('../models/DocGia');
const { generateOTP, sendVerificationEmail } = require('../config/email');

// Đăng nhập cho nhân viên
const loginStaff = async (req, res) => {
  try {
    const { MSNV, password } = req.body;
    const nhanvien = await NhanVien.findOne({ MSNV });
    
    if (!nhanvien) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, nhanvien.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ _id: nhanvien._id.toString() }, process.env.JWT_SECRET);
    res.send({ nhanvien, token });
    console.log(`Đăng nhập thành công: ${nhanvien.MSNV}`);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Đăng nhập cho độc giả
const loginReader = async (req, res) => {
  try {
    const { email, password } = req.body;
    const docgia = await DocGia.findOne({ email });
    
    if (!docgia) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, docgia.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ _id: docgia._id.toString() }, process.env.JWT_SECRET);
    res.send({ docgia, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Đăng ký cho độc giả
const registerReader = async (req, res) => {
  try {
    const docgia = new DocGia(req.body);
    docgia.password = await bcrypt.hash(docgia.password, 8);
    await docgia.save();
    const token = jwt.sign({ _id: docgia._id.toString() }, process.env.JWT_SECRET);
    res.status(201).send({ docgia, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Gửi yêu cầu đổi mật khẩu
const requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      const docgia = await DocGia.findOne({ email });
  
      if (!docgia) {
        return res.status(404).send({ error: 'Email not found' });
      }
  
      // Generate OTP and store it (e.g., in docgia or a separate collection)
      const otp = generateOTP();
      docgia.otp = otp; // Lưu OTP vào model (nên mã hóa hoặc dùng collection riêng)
      docgia.otpExpiry = Date.now() + 10 * 60 * 1000; // Hiệu lực 10 phút
      await docgia.save();
  
      // Send verification email
      await sendVerificationEmail(email, otp);
  
      res.send({ message: 'Verification email sent. Please check your inbox.' });
    } catch (error) {
      res.status(500).send({ error: error.message || 'Failed to request password reset' });
    }
  };
  
  // Xác nhận OTP và đổi mật khẩu
  const confirmPasswordReset = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const docgia = await DocGia.findOne({ email });
  
      console.log(docgia.otp, otp, Date.now(), docgia.otpExpiry);
        console.log(otp)
        // Kiểm tra OTP và thời gian hết hạn
      if (docgia.otp !== otp) {
        return res.status(400).send({ error: 'Invalid OTP' });
      }if (Date.now() > docgia.otpExpiry) {
        return res.status(400).send({ error: 'OTP has expired' });
      }if (!docgia){
        return res.status(404).send({ error: 'Email not found' });
      }
    
      
  
      // Update password
      docgia.password = await bcrypt.hash(newPassword, 8);
      docgia.otp = undefined; // Xóa OTP sau khi xác nhận
      docgia.otpExpiry = undefined;
      await docgia.save();
  
      res.send({ message: 'Password updated successfully. Redirecting to login.' });
    } catch (error) {
      res.status(500).send({ error: error.message || 'Failed to update password' });
    }
  };

module.exports = {
  loginStaff,
  loginReader,
  registerReader,
  requestPasswordReset,
  confirmPasswordReset
};