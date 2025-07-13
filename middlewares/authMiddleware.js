// backend/middlewares/authMiddleware.js

// Import các thư viện và model cần thiết
const jwt = require('jsonwebtoken'); // Thư viện để xác thực JSON Web Token
const NhanVien = require('../models/NhanVien'); // Model Nhân Viên
const DocGia = require('../models/DocGia'); // Model Độc Giả

// Middleware xác thực người dùng (nhân viên hoặc độc giả)
const auth = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization, loại bỏ tiền tố 'Bearer '
    const token = req.header('Authorization').replace('Bearer ', '');
    // Xác thực token với JWT_SECRET từ biến môi trường
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kiểm tra xem token thuộc nhân viên hay độc giả
    const nhanvien = await NhanVien.findOne({ _id: decoded._id });
    const docgia = await DocGia.findOne({ _id: decoded._id });
    
    // Nếu không tìm thấy cả nhân viên lẫn độc giả, ném lỗi
    if (!nhanvien && !docgia) {
      throw new Error();
    }

    // Lưu token và thông tin người dùng vào req để sử dụng trong các route
    req.token = token;
    req.user = nhanvien || docgia; // Lưu nhân viên hoặc độc giả
    req.userType = nhanvien ? 'staff' : 'reader'; // Xác định loại người dùng
    // Chuyển sang middleware hoặc route tiếp theo
    next();
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 401 (Unauthorized) nếu xác thực thất bại
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Middleware kiểm tra quyền admin (chỉ dành cho nhân viên)
const adminAuth = async (req, res, next) => {
  try {
    // Kiểm tra xem người dùng có phải là nhân viên (staff) không
    if (req.userType === 'staff') {
      // Nếu là nhân viên, chuyển sang middleware hoặc route tiếp theo
      next();
    } else {
      // Nếu không phải nhân viên, ném lỗi
      throw new Error();
    }
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 403 (Forbidden) nếu không có quyền
    res.status(403).send({ error: 'Access denied.' });
  }
};

// Xuất các middleware để sử dụng trong file routes
module.exports = { auth, adminAuth };