// backend/controllers/publisherController.js
const NhaXuatBan = require('../models/NhaXuatBan');

// Lấy danh sách tất cả nhà xuất bản
const getAllPublishers = async (req, res) => {
  try {
    const publishers = await NhaXuatBan.find();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm nhà xuất bản mới
const createPublisher = async (req, res) => {
  try {
    const publisher = new NhaXuatBan(req.body);
    await publisher.save();
    res.status(201).json(publisher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin nhà xuất bản
const updatePublisher = async (req, res) => {
  try {
    const publisher = await NhaXuatBan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!publisher) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    res.json(publisher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa nhà xuất bản
const deletePublisher = async (req, res) => {
  try {
    const publisher = await NhaXuatBan.findByIdAndDelete(req.params.id);
    if (!publisher) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    res.json({ message: 'Xóa nhà xuất bản thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một nhà xuất bản
const getPublisherById = async (req, res) => {
  try {
    const publisher = await NhaXuatBan.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    res.json(publisher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
  getPublisherById
};