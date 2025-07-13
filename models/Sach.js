// backend/models/Sach.js
const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
  maSach: {
    type: String,
    required: true,
    unique: true
  },
  tenSach: {
    type: String,
    required: true
  },
  donGia: {
    type: Number,
    required: true
  },
  soQuyen: {
    type: Number,
    required: true
  },
  namXuatBan: {
    type: Number,
    required: true
  },
  maNXB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NhaXuatBan',
    required: true
  },
  nguonGoc: {
    type: String,
    required: true
  },
  maTacGia:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TacGia',
    required: true
  },
  imagePath: {
    type: String
  }
    
}, {
  timestamps: true
});

module.exports = mongoose.model('Sach', sachSchema);