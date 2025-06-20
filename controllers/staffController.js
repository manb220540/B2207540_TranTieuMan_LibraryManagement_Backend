// backend/routes/staffRoutes.js
const NhanVien = require('../models/NhanVien');
const bcrypt = require('bcryptjs');

// Lấy danh sách tất cả nhân viên
const getAllStaff = async (req, res) => {
  try {
    const staff = await NhanVien.find().select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm nhân viên mới
const createStaff = async (req, res) => {
  try {
    const { MSNV, password, ...staffData } = req.body;
    
    // Kiểm tra MSNV đã tồn tại
    const existingStaff = await NhanVien.findOne({ MSNV });
    if (existingStaff) {
      return res.status(400).json({ message: 'MSNV đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 8);
    
    const staff = new NhanVien({
      MSNV,
      password: hashedPassword,
      ...staffData
    });
    
    await staff.save();
    const staffResponse = staff.toObject();
    delete staffResponse.password;
    
    res.status(201).json(staffResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin nhân viên
const updateStaff = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    // Nếu có cập nhật mật khẩu
    if (password) {
      updateData.password = await bcrypt.hash(password, 8);
    }

    const staff = await NhanVien.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa nhân viên
const deleteStaff = async (req, res) => {
  try {
    const staff = await NhanVien.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một nhân viên
const getStaffById = async (req, res) => {
  try {
    const staff = await NhanVien.findById(req.params.id).select('-password');
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffById
};