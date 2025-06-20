const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const NhanVien = require('../models/NhanVien');


const createAdmin = async () => {
  try {
    // Kết nối tới MongoDB
    await mongoose.connect("mongodb://localhost:27017/library_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await NhanVien.findOne({ MSNV: 'ADMIN001' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 8);
      const admin = new NhanVien({
        MSNV: 'ADMIN001',
        hoTenNV: 'Admin',
        password: hashedPassword,
        chucVu: 'Admin',
        diaChi: 'Admin Address',
        soDienThoai: '0123456789',
      });
      await admin.save();
      console.log('Default admin created');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    // Đóng kết nối sau khi hoàn thành
    await mongoose.connection.close();
  }
};

createAdmin();