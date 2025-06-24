// backend/controllers/bookController.js
const Sach = require('../models/Sach');

// Lấy danh sách tất cả sách
const getAllBooks = async (req, res) => {
  try {
    const books = await Sach.find()
      .populate('maNXB') // Chỉ lấy trường tenNXB
      .populate('maTacGia'); // Thêm populate cho maTacGia, chỉ lấy tenTacGia
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sách mới
const createBook = async (req, res) => {
  try {
    const book = new Sach(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error('Create book error:', error); // Log lỗi để debug
  }
};

// Cập nhật thông tin sách
const updateBook = async (req, res) => {
  try {
    const book = await Sach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error('Update book error:', error); // Log lỗi để debug
  }
};

// Xóa sách
const deleteBook = async (req, res) => {
  try {
    const book = await Sach.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    res.json({ message: 'Xóa sách thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error('Delete book error:', error); // Log lỗi để debug
  }
};

// Lấy thông tin một sách
const getBookById = async (req, res) => {
  try {
    const book = await Sach.findById(req.params.id)
      .populate('maNXB') // Chỉ lấy trường tenNXB
      .populate('maTacGia'); // Thêm populate cho maTacGia, chỉ lấy tenTacGia
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error('Get book by ID error:', error); // Log lỗi để debug
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookById
};