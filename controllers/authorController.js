// backend/controllers/authorController.js
const NhaXuatBan = require('../models/TacGia');

// Lay danh sách tác giả
const getAllAuthors = async (req, res) => {
  try {
    const authors = await NhaXuatBan.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm tác giả mới
const createAuthor = async (req, res) => {
  try {
    const author = new NhaXuatBan(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error('Create author error:', error); // Log lỗi để debug
  }
};

// Cập nhật thông tin tác giả
const updateAuthor = async (req, res) => {
  try {
    const author = await NhaXuatBan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
    res.json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Xóa tác giả
const deleteAuthor = async (req, res) => {
  try {
    const author = await NhaXuatBan.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
    res.json({ message: 'Xóa tác giả thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Lấy thông tin một tác giả
const getAuthorById = async (req, res) => {
  try {
    const author = await NhaXuatBan.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export các hàm để sử dụng trong routes
module.exports = {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorById
};
