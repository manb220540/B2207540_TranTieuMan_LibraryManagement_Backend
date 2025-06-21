// backend/src/models/TacGia.js
const mongoose = require('mongoose');
const tacGiaSchema = new mongoose.Schema({
  maTacGia: {
    type: String,
    required: true,
    unique: true
  },
  tenTacGia: {
    type: String,
    required: true
  },
  diaChi: {
    type: String,
    required: true
  },
  soDienThoai: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('TacGia', tacGiaSchema);