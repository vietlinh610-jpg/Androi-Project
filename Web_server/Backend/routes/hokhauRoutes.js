const express = require('express');
const router = express.Router();
const hokhauController = require('../controllers/hokhauController');

// 1. Lấy danh sách: GET http://localhost:5000/api/hokhau
router.get('/', hokhauController.getListHoKhau);

// 3. Thêm mới: POST http://localhost:5000/api/hokhau
router.post('/', hokhauController.createHoKhau);

// 4. Sửa: PUT http://localhost:5000/api/hokhau/1
router.put('/:id', hokhauController.updateHoKhau);

router.delete('/:id', hokhauController.deleteHoKhau);

router.get('/thongtin-chuho/:maHoKhau', hokhauController.getThongTinChuHo);

module.exports = router;