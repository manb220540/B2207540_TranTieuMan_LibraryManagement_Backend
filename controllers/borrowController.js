// backend/controllers/borrowController.js
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const Sach = require('../models/Sach');

  const getAllBorrowRequests = async (req, res) => {
    try {
      const requests = await TheoDoiMuonSach.find()
        .populate('maDocGia')
        .populate('maSach') 
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Lấy lịch sử mượn sách của một độc giả
const getReaderBorrowHistory = async (req, res) => {
  try {
    const history = await TheoDoiMuonSach.find({ maDocGia: req.user._id })
      .populate({
        path: 'maSach',
        select: 'maSach tenSach soQuyen'
      })
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Tạo yêu cầu mượn sách mới
const createBorrowRequest = async (req, res) => {
  try {
    const borrowRequest = new TheoDoiMuonSach({
      maDocGia: req.user._id,
      maSach: req.body.maSach,
      ngayMuon: new Date(),
      trangThai: 'Chờ duyệt'
    });
    await borrowRequest.save();
    res.status(201).json(borrowRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBorrowRequest = async (req, res) => {
  try {
    const { trangThai } = req.body;
    const request = await TheoDoiMuonSach.findById(req.params.id)
      .populate('maSach')
      .populate('maDocGia');

    if (!request) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu mượn sách' });
    }

    const book = await Sach.findById(request.maSach._id);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }

    // Kiểm tra và cập nhật số lượng sách
    if (trangThai === 'Đã duyệt') {
      if (book.soQuyen <= 0) {
        return res.status(400).json({ message: 'Sách đã hết, không thể cho mượn' });
      }
      book.soQuyen -= 1;
    } 
    else if (trangThai === 'Đã trả' && request.trangThai === 'Đã duyệt') {
      book.soQuyen += 1;
    }

    await book.save();
    request.trangThai = trangThai;
    if (trangThai === 'Đã trả') {
      request.ngayTra = new Date();
    }

    await request.save();
    
    // Trả về cả thông tin sách đã cập nhật
    const response = {
      ...request.toObject(),
      maSach: {
        ...request.maSach.toObject(),
        soQuyen: book.soQuyen
      }
    };

    return res.json(response);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllBorrowRequests,
  getReaderBorrowHistory,
  createBorrowRequest,
  updateBorrowRequest
};