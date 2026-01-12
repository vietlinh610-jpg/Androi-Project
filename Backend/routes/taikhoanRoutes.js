const express = require('express');
const router = express.Router();
const taiKhoanController = require('../controllers/taikhoanController');

router.get('/', taiKhoanController.getTaiKhoan);
router.post('/', taiKhoanController.createTaiKhoan);
router.delete('/:id', taiKhoanController.deleteTaiKhoan);
router.put('/:id', taiKhoanController.updateTaiKhoan);

module.exports = router;