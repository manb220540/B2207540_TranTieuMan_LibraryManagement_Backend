// backend/controllers/userController.js
const DocGia = require('../models/DocGia');

// Lấy danh sách tất cả độc giả (chỉ admin)
const getAllReaders = async (req, res) => {
  try {
    const readers = await DocGia.find().select('-password');
    res.json(readers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một độc giả theo ID (chỉ admin)
const getReaderById = async (req, res) => {
  try {
    const reader = await DocGia.findById(req.params.id).select('-password');
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }
    res.json(reader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa độc giả (chỉ admin)
const deleteReader = async (req, res) => {
  try {
    const reader = await DocGia.findByIdAndDelete(req.params.id);
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }
    res.json({ message: 'Xóa độc giả thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin cá nhân (cho độc giả)
const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['hoLot', 'ten', 'ngaySinh', 'phai', 'diaChi', 'dienThoai', 'email'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    const reader = await DocGia.findById(req.user._id);
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }

    updates.forEach(update => reader[update] = req.body[update]);
    await reader.save();
    
    const readerResponse = reader.toObject();
    delete readerResponse.password;
    
    res.json(readerResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy thông tin cá nhân của độc giả (đã xác thực)
const getProfile = async (req, res) => {
  try {
    const reader = await DocGia.findById(req.user._id).select('-password');
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }
    res.json(reader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReaders,
  getReaderById,
  deleteReader,
  updateProfile,
  getProfile
};