// backend/models/Sach.js
const mongoose = require('mongoose');

const SachSchema = new mongoose.Schema({
  MaSach: { type: String, unique: true, required: true }, // Unique book ID
  TenSach: { type: String, required: true }, // Book title
  DonGia: { type: Number }, // Price
  SoQuyen: { type: Number, required: true }, // Quantity
  NamXuatBan: { type: Number }, // Publication year
  MaNXB: { type: String, required: true }, // Publisher ID
  NguonGoc: { type: String }, // Origin or author
});

module.exports = mongoose.model('Sach', SachSchema);