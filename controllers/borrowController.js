// backend/controllers/borrowController.js
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const Sach = require('../models/Sach');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');
const transporter = require('../config/email');

// Create new borrow request
exports.createBorrow = async (req, res, io) => {
  try {
    const { MaSach, SoLuong } = req.body;
    const book = await Sach.findOne({ MaSach });
    if (!book || book.SoQuyen < SoLuong) {
      return res.status(400).json({ message: 'Book unavailable or insufficient quantity' });
    }

    const MaPhieu = `PM${Date.now()}`;
    const borrow = new TheoDoiMuonSach({
      MaPhieu,
      MaDocGia: req.user.id,
      MaSach,
      NgayMuon: new Date(),
      SoLuong,
    });
    await borrow.save();

    // Notify admins
    const admins = await NhanVien.find();
    for (const admin of admins) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: admin.Email,
        subject: 'New Borrow Request',
        html: `<p>New borrow request ${MaPhieu} for book ${MaSach}.</p>`,
      });
      io.to(admin._id.toString()).emit('newBorrowRequest', { MaPhieu, MaSach });
    }

    res.status(201).json(borrow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get borrow requests for user
exports.getUserBorrows = async (req, res) => {
  try {
    const borrows = await TheoDoiMuonSach.find({ MaDocGia: req.user.id }).populate('MaSach');
    res.json(borrows);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all borrow requests for admin
exports.getAllBorrows = async (req, res) => {
  try {
    const borrows = await TheoDoiMuonSach.find().populate('MaDocGia MaSach');
    res.json(borrows);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update borrow status
exports.updateBorrowStatus = async (req, res, io) => {
  try {
    const borrow = await TheoDoiMuonSach.findById(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow not found' });
    borrow.TrangThai = req.body.TrangThai;
    await borrow.save();

    // Notify user
    const user = await DocGia.findOne({ MaDocGia: borrow.MaDocGia });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.Email,
      subject: 'Borrow Request Update',
      html: `<p>Your borrow request for book ${borrow.MaSach} has been ${req.body.TrangThai}.</p>`,
    });

    io.to(user._id.toString()).emit('borrowStatus', {
      MaPhieu: borrow.MaPhieu,
      TrangThai: req.body.TrangThai,
    });

    res.json(borrow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};