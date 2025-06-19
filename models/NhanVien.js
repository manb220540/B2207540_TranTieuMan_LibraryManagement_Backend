// backend/models/NhanVien.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const NhanVienSchema = new mongoose.Schema({
  MSNV: { type: String, unique: true, required: true }, // Unique employee ID
  HoTenNV: { type: String, required: true }, // Full name
  Password: { type: String, required: true }, // Hashed password
  ChucVu: { type: String, required: true }, // Position
  DiaChi: { type: String }, // Address
  SoDienThoai: { type: String }, // Phone number
  Email: { type: String, unique: true, required: true }, // Email for login
});

// Hash password before saving
NhanVienSchema.pre('save', async function (next) {
  if (this.isModified('Password')) {
    this.Password = await bcrypt.hash(this.Password, 10);
  }
  next();
});

// Compare password for login
NhanVienSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = mongoose.model('NhanVien', NhanVienSchema);