// backend/models/NhaXuatBan.js
const mongoose = require('mongoose');

const NhaXuatBanSchema = new mongoose.Schema({
  MaNXB: { type: String, unique: true, required: true }, // Unique publisher ID
  TenNXB: { type: String, required: true }, // Publisher name
  DiaChi: { type: String }, // Publisher address
});

module.exports = mongoose.model('NhaXuatBan', NhaXuatBanSchema);