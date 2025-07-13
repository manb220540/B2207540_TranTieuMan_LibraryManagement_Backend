// backend/controllers/authorController.js

// Import model TacGia (lưu ý: tên biến NhaXuatBan có thể là nhầm lẫn, nên là TacGia)
const NhaXuatBan = require('../models/TacGia');

// Lấy danh sách tác giả
const getAllAuthors = async (req, res) => {
  try {
    // Tìm tất cả bản ghi trong collection TacGia
    const authors = await NhaXuatBan.find();
    // Trả về danh sách tác giả dưới dạng JSON
    res.json(authors);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Thêm tác giả mới
const createAuthor = async (req, res) => {
  try {
    // Tạo instance mới của TacGia từ dữ liệu trong req.body
    const author = new NhaXuatBan(req.body);
    // Lưu tác giả vào database
    await author.save();
    // Trả về tác giả vừa tạo với mã trạng thái 201 (Created)
    res.status(201).json(author);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 (Bad Request) và thông báo lỗi
    res.status(400).json({ message: error.message });
    // Ghi log lỗi để hỗ trợ debug
    console.error('Create author error:', error);
  }
};

// Cập nhật thông tin tác giả
const updateAuthor = async (req, res) => {
  try {
    // Tìm và cập nhật tác giả theo ID, trả về bản ghi đã cập nhật
    const author = await NhaXuatBan.findByIdAndUpdate(
      req.params.id, // ID của tác giả từ tham số URL
      req.body, // Dữ liệu cập nhật từ body
      { new: true } // Trả về bản ghi sau khi cập nhật
    );
    // Kiểm tra nếu không tìm thấy tác giả
    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
    // Trả về thông tin tác giả đã cập nhật
    res.json(author);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Xóa tác giả
const deleteAuthor = async (req, res) => {
  try {
    // Tìm và xóa tác giả theo ID
    const author = await NhaXuatBan.findByIdAndDelete(req.params.id);
    // Kiểm tra nếu không tìm thấy tác giả
    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
    // Trả về thông báo xóa thành công
    res.json({ message: 'Xóa tác giả thành công' });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một tác giả theo ID
const getAuthorById = async (req, res) => {
  try {
    // Tìm tác giả theo ID từ tham số URL
    const author = await NhaXuatBan.findById(req.params.id);
    // Kiểm tra nếu không tìm thấy tác giả
    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }
    // Trả về thông tin tác giả
    res.json(author);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
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