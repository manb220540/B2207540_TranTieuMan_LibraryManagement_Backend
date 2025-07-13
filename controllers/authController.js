// backend/controllers/authController.js

// Import các thư viện và model cần thiết
const jwt = require('jsonwebtoken'); // Thư viện để tạo và xác thực JWT
const bcrypt = require('bcryptjs'); // Thư viện để mã hóa và so sánh mật khẩu
const NhanVien = require('../models/NhanVien'); // Model Nhân Viên
const DocGia = require('../models/DocGia'); // Model Độc Giả
const { generateOTP, sendVerificationEmail } = require('../config/email'); // Import hàm tạo OTP và gửi email

// Đăng nhập cho nhân viên
const loginStaff = async (req, res) => {
  try {
    const { MSNV, password } = req.body; // Lấy MSNV và password từ body
    // Tìm nhân viên theo MSNV
    const nhanvien = await NhanVien.findOne({ MSNV });
    
    // Kiểm tra nếu không tìm thấy nhân viên
    if (!nhanvien) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, nhanvien.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    // Tạo JWT token với ID nhân viên
    const token = jwt.sign({ _id: nhanvien._id.toString() }, process.env.JWT_SECRET);
    // Trả về thông tin nhân viên và token
    res.send({ nhanvien, token });
    console.log(`Đăng nhập thành công: ${nhanvien.MSNV}`);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400
    res.status(400).send(error);
  }
};

// Đăng nhập cho độc giả
const loginReader = async (req, res) => {
  try {
    const { email, password } = req.body; // Lấy email và password từ body
    // Tìm độc giả theo email
    const docgia = await DocGia.findOne({ email });
    
    // Kiểm tra nếu không tìm thấy độc giả
    if (!docgia) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, docgia.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    // Tạo JWT token với ID độc giả
    const token = jwt.sign({ _id: docgia._id.toString() }, process.env.JWT_SECRET);
    // Trả về thông tin độc giả và token
    res.send({ docgia, token });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400
    res.status(400).send(error);
  }
};

// Đăng ký cho độc giả
const registerReader = async (req, res) => {
  try {
    // Tạo instance độc giả mới từ dữ liệu trong req.body
    const docgia = new DocGia(req.body);
    // Mã hóa mật khẩu với độ dài salt là 8
    docgia.password = await bcrypt.hash(docgia.password, 8);
    // Lưu độc giả vào database
    await docgia.save();
    // Tạo JWT token với ID độc giả
    const token = jwt.sign({ _id: docgia._id.toString() }, process.env.JWT_SECRET);
    // Trả về thông tin độc giả và token với mã trạng thái 201 (Created)
    res.status(201).send({ docgia, token });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400
    res.status(400).send(error);
  }
};

// Gửi yêu cầu đổi mật khẩu
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body; // Lấy email từ body
    // Tìm độc giả theo email
    const docgia = await DocGia.findOne({ email });
  
    // Kiểm tra nếu không tìm thấy độc giả
    if (!docgia) {
      return res.status(404).send({ error: 'Email not found' });
    }
  
    // Tạo OTP và lưu vào model độc giả
    const otp = generateOTP();
    docgia.otp = otp; // Lưu OTP (nên cân nhắc mã hóa hoặc dùng collection riêng)
    docgia.otpExpiry = Date.now() + 10 * 60 * 1000; // Thiết lập thời gian hết hạn OTP (10 phút)
    await docgia.save();
  
    // Gửi email chứa OTP
    await sendVerificationEmail(email, otp);
  
    // Trả về thông báo gửi email thành công
    res.send({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500
    res.status(500).send({ error: error.message || 'Failed to request password reset' });
  }
};

// Xác nhận OTP và đổi mật khẩu
const confirmPasswordReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body; // Lấy email, OTP và mật khẩu mới từ body
    // Tìm độc giả theo email
    const docgia = await DocGia.findOne({ email });
  
    // Kiểm tra nếu không tìm thấy độc giả
    if (!docgia) {
      return res.status(404).send({ error: 'Email not found' });
    }
    
    // Kiểm tra OTP và thời gian hết hạn
    if (docgia.otp !== otp) {
      return res.status(400).send({ error: 'Invalid OTP' });
    }
    if (Date.now() > docgia.otpExpiry) {
      return res.status(400).send({ error: 'OTP has expired' });
    }
  
    // Cập nhật mật khẩu mới (mã hóa trước khi lưu)
    docgia.password = await bcrypt.hash(newPassword, 8);
    // Xóa OTP và thời gian hết hạn
    docgia.otp = undefined;
    docgia.otpExpiry = undefined;
    await docgia.save();
  
    // Trả về thông báo đổi mật khẩu thành công
    res.send({ message: 'Password updated successfully. Redirecting to login.' });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500
    res.status(500).send({ error: error.message || 'Failed to update password' });
  }
};

// Xuất các hàm để sử dụng trong routes
module.exports = {
  loginStaff,
  loginReader,
  registerReader,
  requestPasswordReset,
  confirmPasswordReset
};