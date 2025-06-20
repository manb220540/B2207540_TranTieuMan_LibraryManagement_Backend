// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const NhanVien = require('../models/NhanVien');
const DocGia = require('../models/DocGia');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kiểm tra token từ nhân viên hoặc độc giả
    const nhanvien = await NhanVien.findOne({ _id: decoded._id });
    const docgia = await DocGia.findOne({ _id: decoded._id });
    
    if (!nhanvien && !docgia) {
      throw new Error();
    }

    req.token = token;
    req.user = nhanvien || docgia;
    req.userType = nhanvien ? 'staff' : 'reader';
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (req.userType === 'staff') {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(403).send({ error: 'Access denied.' });
  }
};

module.exports = { auth, adminAuth };