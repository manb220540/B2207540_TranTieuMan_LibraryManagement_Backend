// backend/controllers/publisherController.js

// Import model NhaXuatBan để tương tác với collection nhà xuất bản trong MongoDB
const NhaXuatBan = require('../models/NhaXuatBan');

// Lấy danh sách tất cả nhà xuất bản
const getAllPublishers = async (req, res) => {
  try {
    // Tìm tất cả bản ghi trong collection NhaXuatBan
    const publishers = await NhaXuatBan.find();
    // Trả về danh sách nhà xuất bản dưới dạng JSON
    res.json(publishers);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Thêm nhà xuất bản mới
const createPublisher = async (req, res) => {
  try {
    // Tạo instance mới của NhaXuatBan từ dữ liệu trong req.body
    const publisher = new NhaXuatBan(req.body);
    // Lưu nhà xuất bản vào database
    await publisher.save();
    // Trả về nhà xuất bản vừa tạo với mã trạng thái 201 (Created)
    res.status(201).json(publisher);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 (Bad Request) và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin nhà xuất bản
const updatePublisher = async (req, res) => {
  try {
    // Tìm và cập nhật nhà xuất bản theo ID từ tham số URL
    // req.body chứa dữ liệu cập nhật, { new: true } trả về bản ghi sau khi cập nhật
    const publisher = await NhaXuatBan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // Kiểm tra nếu không tìm thấy nhà xuất bản
    if (!publisher) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    // Trả về thông tin nhà xuất bản đã cập nhật
    res.json(publisher);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 (Bad Request) và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Xóa nhà xuất bản
const deletePublisher = async (req, res) => {
  try {
    // Tìm và xóa nhà xuất bản theo ID từ tham số URL
    const publisher = await NhaXuatBan.findByIdAndDelete(req.params.id);
    // Kiểm tra nếu không tìm thấy nhà xuất bản
    if (!publisher) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    // Trả về thông báo xóa thành công
    res.json({ message: 'Xóa nhà xuất bản thành công' });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một nhà xuất bản theo ID
const getPublisherById = async (req, res) => {
  try {
    // Tìm nhà xuất bản theo ID từ tham số URL
    const publisher = await NhaXuatBan.findById(req.params.id);
    // Kiểm tra nếu không tìm thấy nhà xuất bản
    if (!publisher) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    // Trả về thông tin nhà xuất bản
    res.json(publisher);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Xuất các hàm để sử dụng trong file routes
module.exports = {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
  getPublisherById
};