// backend/controllers/bookController.js
const Sach = require('../models/Sach');
const NhaXuatBan = require('../models/NhaXuatBan');

// Get all books with optional search
exports.getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { $or: [{ TenSach: new RegExp(search, 'i') }, { NguonGoc: new RegExp(search, 'i') }] } : {};
    const books = await Sach.find(query).populate('MaNXB');
    res.json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};