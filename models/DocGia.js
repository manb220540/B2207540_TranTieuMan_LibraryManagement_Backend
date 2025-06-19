// backend/models/DocGia.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DocGiaSchema = new mongoose.Schema({
  MaDocGia: { type: String, unique: true, required: true }, // Unique reader ID
  HoLot: { type: String, required: true }, // Middle name
  Ten: { type: String, required: true }, // First name
  NgaySinh: { type: Date }, // Date of birth
  Phai: { type: String, enum: ['Nam', 'Nu', 'Khac'] }, // Gender
  DiaChi: { type: String }, // Address
  DienThoai: { type: String }, // Phone number
  Email: { type: String, unique: true, required: true }, // Email for login
  Password: { type: String, required: true }, // Hashed password
  Verified: { type: Boolean, default: false }, // Email verification status
  VerificationToken: { type: String }, // Token for email verification
});

// Hash password before saving
DocGiaSchema.pre('save', async function (next) {
  if (this.isModified('Password')) {
    this.Password = await bcrypt.hash(this.Password, 10);
  }
  next();
});

// Compare password for login
DocGiaSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = mongoose.model('DocGia', DocGiaSchema);