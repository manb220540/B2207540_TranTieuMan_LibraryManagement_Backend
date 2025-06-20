// backend/models/NhaXuatBan.js
const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema({
  maNXB: {
    type: String,
    required: true,
    unique: true
  },
  tenNXB: {
    type: String,
    required: true
  },
  diaChi: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);