// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NhanVien = require('../models/NhanVien');
const DocGia = require('../models/DocGia');

// Đăng nhập cho nhân viên
const loginStaff = async (req, res) => {
  try {
    const { MSNV, password } = req.body;
    const nhanvien = await NhanVien.findOne({ MSNV });
    
    if (!nhanvien) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, nhanvien.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ _id: nhanvien._id.toString() }, process.env.JWT_SECRET);
    res.send({ nhanvien, token });
    console.log(`Đăng nhập thành công: ${nhanvien.MSNV}`);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Đăng nhập cho độc giả
const loginReader = async (req, res) => {
  try {
    const { email, password } = req.body;
    const docgia = await DocGia.findOne({ email });
    
    if (!docgia) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, docgia.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ _id: docgia._id.toString() }, process.env.JWT_SECRET);
    res.send({ docgia, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Đăng ký cho độc giả
const registerReader = async (req, res) => {
  try {
    const docgia = new DocGia(req.body);
    docgia.password = await bcrypt.hash(docgia.password, 8);
    await docgia.save();
    const token = jwt.sign({ _id: docgia._id.toString() }, process.env.JWT_SECRET);
    res.status(201).send({ docgia, token });
  } catch (error) {
    res.status(400).send(error);
  }
};



module.exports = {
  loginStaff,
  loginReader,
  registerReader
};