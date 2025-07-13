// backend/routes/staffRoutes.js

// Import model NhanVien để tương tác với collection nhân viên trong MongoDB
const NhanVien = require('../models/NhanVien');
// Import bcrypt để mã hóa và quản lý mật khẩu
const bcrypt = require('bcryptjs');

// Lấy danh sách tất cả nhân viên
const getAllStaff = async (req, res) => {
  try {
    // Tìm tất cả nhân viên, loại bỏ trường password khỏi kết quả
    const staff = await NhanVien.find().select('-password');
    // Trả về danh sách nhân viên dưới dạng JSON
    res.json(staff);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Thêm nhân viên mới
const createStaff = async (req, res) => {
  try {
    // Lấy MSNV, password và các dữ liệu khác từ req.body
    const { MSNV, password, ...staffData } = req.body;
    
    // Kiểm tra xem MSNV đã tồn tại trong database chưa
    const existingStaff = await NhanVien.findOne({ MSNV });
    if (existingStaff) {
      return res.status(400).json({ message: 'MSNV đã tồn tại' });
    }

    // Mã hóa mật khẩu với độ dài salt là 8
    const hashedPassword = await bcrypt.hash(password, 8);
    
    // Tạo instance nhân viên mới với MSNV, mật khẩu mã hóa và dữ liệu còn lại
    const staff = new NhanVien({
      MSNV,
      password: hashedPassword,
      ...staffData
    });
    
    // Lưu nhân viên vào database
    await staff.save();
    // Tạo bản sao của nhân viên và loại bỏ trường password trước khi trả về
    const staffResponse = staff.toObject();
    delete staffResponse.password;
    
    // Trả về nhân viên vừa tạo với mã trạng thái 201 (Created)
    res.status(201).json(staffResponse);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 (Bad Request) và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin nhân viên
const updateStaff = async (req, res) => {
  try {
    // Lấy password và các dữ liệu khác từ req.body
    const { password, ...updateData } = req.body;
    
    // Nếu có password mới, mã hóa trước khi cập nhật
    if (password) {
      updateData.password = await bcrypt.hash(password, 8);
    }

    // Tìm và cập nhật nhân viên theo ID, trả về bản ghi đã cập nhật
    // Loại bỏ trường password khỏi kết quả trả về
    const staff = await NhanVien.findByIdAndUpdate(
      req.params.id, // ID từ tham số URL
      updateData, // Dữ liệu cập nhật
      { new: true } // Trả về bản ghi sau khi cập nhật
    ).select('-password');
    
    // Kiểm tra nếu không tìm thấy nhân viên
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    
    // Trả về thông tin nhân viên đã cập nhật
    res.json(staff);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 (Bad Request) và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Xóa nhân viên
const deleteStaff = async (req, res) => {
  try {
    // Tìm và xóa nhân viên theo ID từ tham số URL
    const staff = await NhanVien.findByIdAndDelete(req.params.id);
    // Kiểm tra nếu không tìm thấy nhân viên
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    // Trả về thông báo xóa thành công
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một nhân viên theo ID
const getStaffById = async (req, res) => {
  try {
    // Tìm nhân viên theo ID, loại bỏ trường password khỏi kết quả
    const staff = await NhanVien.findById(req.params.id).select('-password');
    // Kiểm tra nếu không tìm thấy nhân viên
    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    // Trả về thông tin nhân viên
    res.json(staff);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 (Internal Server Error) và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Xuất các hàm để sử dụng trong file routes
module.exports = {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffById
};