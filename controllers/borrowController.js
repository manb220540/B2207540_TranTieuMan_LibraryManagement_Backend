// backend/controllers/borrowController.js

// Import các model cần thiết
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach'); // Model TheoDoiMuonSach để quản lý yêu cầu mượn sách
const Sach = require('../models/Sach'); // Model Sach để quản lý thông tin sách

// Lấy danh sách tất cả yêu cầu mượn sách
const getAllBorrowRequests = async (req, res) => {
  try {
    // Tìm tất cả yêu cầu mượn sách
    // Populate để lấy thông tin chi tiết của độc giả và sách
    // Sắp xếp theo thời gian tạo (mới nhất trước)
    const requests = await TheoDoiMuonSach.find()
      .populate('maDocGia') // Liên kết với collection DocGia
      .populate('maSach') // Liên kết với collection Sach
      .sort({ createdAt: -1 });
    // Trả về danh sách yêu cầu dưới dạng JSON
    res.json(requests);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Lấy lịch sử mượn sách của một độc giả
const getReaderBorrowHistory = async (req, res) => {
  try {
    // Tìm các yêu cầu mượn sách của độc giả dựa trên ID từ req.user
    // Populate để lấy thông tin sách (chỉ lấy các trường maSach, tenSach, soQuyen)
    // Sắp xếp theo thời gian tạo (mới nhất trước)
    const history = await TheoDoiMuonSach.find({ maDocGia: req.user._id })
      .populate({
        path: 'maSach',
        select: 'maSach tenSach soQuyen'
      })
      .sort({ createdAt: -1 });
    // Trả về lịch sử mượn sách dưới dạng JSON
    res.json(history);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

// Tạo yêu cầu mượn sách mới
const createBorrowRequest = async (req, res) => {
  try {
    // Tạo instance yêu cầu mượn sách mới
    const borrowRequest = new TheoDoiMuonSach({
      maDocGia: req.user._id, // ID độc giả từ thông tin người dùng đã xác thực
      maSach: req.body.maSach, // Mã sách từ body
      ngayMuon: new Date(), // Ngày mượn là thời điểm hiện tại
      trangThai: 'Chờ duyệt' // Trạng thái mặc định là Chờ duyệt
    });
    // Lưu yêu cầu vào database
    await borrowRequest.save();
    // Trả về yêu cầu vừa tạo với mã trạng thái 201 (Created)
    res.status(201).json(borrowRequest);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật trạng thái yêu cầu mượn sách
const updateBorrowRequest = async (req, res) => {
  try {
    const { trangThai } = req.body; // Lấy trạng thái từ body
    // Tìm yêu cầu mượn sách theo ID và populate thông tin sách, độc giả
    const request = await TheoDoiMuonSach.findById(req.params.id)
      .populate('maSach')
      .populate('maDocGia');

    // Kiểm tra nếu không tìm thấy yêu cầu
    if (!request) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu mượn sách' });
    }

    // Tìm sách liên quan đến yêu cầu
    const book = await Sach.findById(request.maSach._id);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }

    // Cập nhật số lượng sách dựa trên trạng thái
    if (trangThai === 'Đã duyệt') {
      // Nếu duyệt, kiểm tra số lượng sách
      if (book.soQuyen <= 0) {
        return res.status(400).json({ message: 'Sách đã hết, không thể cho mượn' });
      }
      book.soQuyen -= 1; // Giảm số lượng sách
    } else if (trangThai === 'Đã trả' && request.trangThai === 'Đã duyệt') {
      // Nếu trả sách, tăng số lượng sách
      book.soQuyen += 1;
    }

    // Lưu thay đổi số lượng sách
    await book.save();
    // Cập nhật trạng thái yêu cầu
    request.trangThai = trangThai;
    // Nếu trạng thái là Đã trả, cập nhật ngày trả
    if (trangThai === 'Đã trả') {
      request.ngayTra = new Date();
    }

    // Lưu yêu cầu đã cập nhật
    await request.save();
    
    // Trả về thông tin yêu cầu và số lượng sách đã cập nhật
    const response = {
      ...request.toObject(),
      maSach: {
        ...request.maSach.toObject(),
        soQuyen: book.soQuyen
      }
    };

    return res.json(response);
  } catch (error) {
    // Xử lý lỗi, trả về mã trạng thái 400 và thông báo lỗi
    res.status(400).json({ message: error.message });
  }
};

// Xuất các hàm để sử dụng trong routes
module.exports = {
  getAllBorrowRequests,
  getReaderBorrowHistory,
  createBorrowRequest,
  updateBorrowRequest
};