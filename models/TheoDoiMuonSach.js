// backend/models/TheoDoiMuonSach.js
const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
  maDocGia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocGia',
    required: true
  },
  maSach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sach',
    required: true
  },
  ngayMuon: {
    type: Date,
    required: true,
    default: Date.now
  },
  ngayTra: {
    type: Date
  },
  // Thêm trạng thái cho quá trình duyệt
  trangThai: {
    type: String,
    enum: ['Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Đã trả'],
    default: 'Chờ duyệt'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);