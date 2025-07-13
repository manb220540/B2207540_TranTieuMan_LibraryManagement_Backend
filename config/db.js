// backend/config/db.js

// Import thư viện mongoose để làm việc với MongoDB
const mongoose = require('mongoose');

// Định nghĩa hàm connectDB để kết nối với cơ sở dữ liệu MongoDB
const connectDB = async () => {
  try {
    // Thực hiện kết nối đến MongoDB sử dụng MONGO_URI từ biến môi trường
    // MONGO_URI chứa chuỗi kết nối (connection string) đến database
    await mongoose.connect(process.env.MONGO_URI, {
      // Sử dụng parser mới cho chuỗi kết nối
      useNewUrlParser: true,
      // Sử dụng topology thống nhất để quản lý kết nối
      useUnifiedTopology: true,
    });
    // In ra thông báo khi kết nối thành công
    console.log('MongoDB connected');
  } catch (error) {
    // Xử lý lỗi nếu kết nối thất bại
    console.error('MongoDB connection error:', error);
    // Thoát chương trình với mã lỗi 1
    process.exit(1);
  }
};

// Xuất hàm connectDB để sử dụng ở các file khác
module.exports = connectDB;