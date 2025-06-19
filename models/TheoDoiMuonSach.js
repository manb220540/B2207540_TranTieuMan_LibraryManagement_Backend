// backend/models/TheoDoiMuonSach.js
const mongoose = require('mongoose');

const TheoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: { type: String, required: true }, // Reader ID
  MaSach: { type: String, required: true }, // Book ID
  NgayMuon: { type: Date, required: true }, // Borrow date
  NgayTra: { type: Date }, // Return date
  TrangThai: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'returned'], 
    default: 'pending' 
  }, // Borrow status
  SoLuong: { type: Number, required: true, default: 1 }, // Borrowed quantity
});

module.exports = mongoose.model('TheoDoiMuonSach', TheoDoiMuonSachSchema);