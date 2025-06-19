// backend/scripts/seedAdmin.js
const NhanVien = require('../models/NhanVien');

// Create default admin account
const seedAdmin = async () => {
  try {
    const adminExists = await NhanVien.findOne({ ChucVu: 'Admin' });
    if (!adminExists) {
      const admin = new NhanVien({
        MSNV: 'NV001',
        HoTenNV: 'Admin',
        Password: 'admin123',
        ChucVu: 'Admin',
        Email: 'admin@library.com',
      });
      await admin.save();
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = seedAdmin;