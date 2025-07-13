// backend/controllers/userController.js

// Import model DocGia để tương tác với collection độc giả trong MongoDB
const DocGia = require('../models/DocGia');

// Lấy danh sách tất cả độc giả (chỉ dành cho admin)
const getAllReaders = async (req, res) => {
  try {
    // Tìm tất cả độc giả, loại bỏ trường password khỏi kết quả
    const readers = await DocGia.find().select('-password');
    // Trả về danh sách độc giả dưới dạng JSON
    res.json(readers);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một độc giả theo ID (chỉ dành cho admin)
const getReaderById = async (req, res) => {
  try {
    // Tìm độc giả theo ID từ tham số URL, loại bỏ trường password
    const reader = await DocGia.findById(req.params.id).select('-password');
    // Kiểm tra nếu không tìm thấy độc giả
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }
    // Trả về thông tin độc giả
    res.json(reader);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Xóa độc giả (chỉ dành cho admin)
const deleteReader = async (req, res) => {
  try {
    // Tìm và xóa độc giả theo ID từ tham số URL
    const reader = await DocGia.findByIdAndDelete(req.params.id);
    // Kiểm tra nếu không tìm thấy độc giả
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }
    // Trả về thông báo xóa thành công
    res.json({ message: 'Xóa độc giả thành công' });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin cá nhân của độc giả (cho độc giả đã xác thực)
const updateProfile = async (req, res) => {
  try {
    // Lấy danh sách các trường được gửi trong req.body
    const updates = Object.keys(req.body);
    // Danh sách các trường được phép cập nhật
    const allowedUpdates = ['hoLot', 'ten', 'ngaySinh', 'phai', 'diaChi', 'dienThoai', 'email'];
    // Kiểm tra xem các trường cập nhật có hợp lệ không
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    // Nếu có trường không hợp lệ, trả về lỗi 400
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    // Tìm độc giả theo ID từ thông tin người dùng đã xác thực (req.user._id)
    const reader = await DocGia.findById(req.user._id);
    // Kiểm tra nếu không tìm thấy độc giả
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }

    // Cập nhật từng trường được gửi trong req.body
    updates.forEach(update => reader[update] = req.body[update]);
    // Lưu thay đổi vào database
    await reader.save();
    
    // Tạo bản sao của độc giả và loại bỏ trường password trước khi trả về
    const readerResponse = reader.toObject();
    delete readerResponse.password;
    
    // Trả về thông tin độc giả đã cập nhật
    res.json(readerResponse);
  } catch (error) {
  