const express = require('express');
const router = express.Router();
const canhoController = require('../controllers/canhoController');

// 1. Lấy danh sách: GET /api/canho
router.get('/', canhoController.getListCanHo);

// 2. Thêm căn hộ: POST /api/canho
router.post('/', canhoController.createCanHo);

// 3. Cập nhật Hộ khẩu cho căn hộ: PUT /api/canho/:id
router.put('/:id', canhoController.updateCanHo);

// API Xóa: DELETE /api/canho/:id
router.delete('/:id', canhoController.deleteCanHo);

module.exports = router;