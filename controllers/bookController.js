// backend/controllers/bookController.js

// Import model Sach
const Sach = require('../models/Sach');
const fs = require('fs');
const path = require('path');


// Lấy danh sách tất cả sách
const getAllBooks = async (req, res) => {
  try {
    // Tìm tất cả sách trong database
    // Populate để lấy thông tin chi tiết của nhà xuất bản và tác giả
    const books = await Sach.find()
      .populate('maNXB') // Liên kết với collection NhaXuatBan, lấy thông tin nhà xuất bản
      .populate('maTacGia'); // Liên kết với collection TacGia, lấy thông tin tác giả
    // Trả về danh sách sách dưới dạng JSON
    res.json(books);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Thêm sách mới
const createBook = [
  async (req, res) => {
  try {
    // Tạo instance sách mới từ dữ liệu trong req.body
    //const book = new Sach(req.body);
    const bookData = {
      maSach: req.body.maSach,
      tenSach: req.body.tenSach,
      maNXB: req.body.maNXB,
      maTacGia: req.body.maTacGia,
      donGia: req.body.donGia,
      soQuyen: req.body.soQuyen,
      namXuatBan: req.body.namXuatBan,
      nguonGoc: req.body.nguonGoc,
      imagePath: req.file ? `uploads/${req.file.filename}` : null
    };
    const book = new Sach(bookData);
    // Lưu sách vào database
    await book.save();
    // Trả về sách vừa tạo với mã trạng thái 201 (Created)
    res.status(201).json(book);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 (Bad Request) và thông báo lỗi
    res.status(400).json({ message: error.message });
    // Ghi log lỗi để hỗ trợ debug
    console.error('Create book error:', error);
  }
}
];

// Cập nhật thông tin sách
const updateBook = [
  async (req, res) => {
  try {
    // Kiểm tra nếu có file mới được upload
    if (req.file) {
      req.body.imagePath = `uploads/${req.file.filename}`; // Cập nhật đường dẫn hình ảnh mới
    }
    // Tìm và cập nhật sách theo ID, trả về bản ghi đã cập nhật
    // Cập nhật sách với dữ liệu mới từ req.body
    // Nếu không có file mới, giữ nguyên đường dẫn hình ảnh cũ  
    const book = await Sach.findByIdAndUpdate(
      req.params.id, // ID của sách từ tham số URL
      req.body, // Dữ liệu cập nhật từ body
      { new: true } // Trả về bản ghi sau khi cập nhật
    );
    // Kiểm tra nếu không tìm thấy sách
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    // Trả về thông tin sách đã cập nhật
    res.json(book);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 và thông báo lỗi
    res.status(400).json({ message: error.message });
    // Ghi log lỗi để hỗ trợ debug
    console.error('Update book error:', error);
  }
}
];

// Xóa sách
const deleteBook = async (req, res) => {
  try {
    // Tìm và xóa sách theo ID
    const book = await Sach.findByIdAndDelete(req.params.id);
    // Kiểm tra nếu không tìm thấy sách
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    // Xóa ảnh trong thư mục uploads nếu tồn tại
    if (book.imagePath) {
      const imagePath = path.join(__dirname, '..', 'uploads', book.imagePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Không thể xóa ảnh:', err.message);
        } else {
          console.log('Đã xóa ảnh:', imagePath);
        }
      });
    }
    // Trả về thông báo xóa thành công
    res.json({ message: 'Xóa sách thành công' });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
    // Ghi log lỗi để hỗ trợ debug
    console.error('Delete book error:', error);
  }
};

// Lấy thông tin một sách theo ID
const getBookById = async (req, res) => {
  try {
    // Tìm sách theo ID từ tham số URL
    const book = await Sach.findById(req.params.id)
      .populate('maNXB') // Liên kết với collection NhaXuatBan, lấy thông tin nhà xuất bản
      .populate('maTacGia'); // Liên kết với collection TacGia, lấy thông tin tác giả
    // Kiểm tra nếu không tìm thấy sách
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    // Trả về thông tin sách
    res.json(book);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
    // Ghi log lỗi để hỗ trợ debug
    console.error('Get book by ID error:', error);
  }
};

// Xuất các hàm để sử dụng trong routes
module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookById
};