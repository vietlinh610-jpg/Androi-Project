const express = require("express");
const router = express.Router();
const thuPhiController = require('../controllers/thuPhiController');

// /api/thu-phi/:maKhoanThu/trang-thai
router.get("/:maKhoanThu/trang-thai", thuPhiController.xemTrangThaiThuPhi);

// /api/thu-phi/kiem-tra
router.get("/kiem-tra", thuPhiController.kiemTraKhoanThu);

// /api/thu-phi/thong-ke/:thang/:nam
router.get("/thong-ke/:thang/:nam", thuPhiController.thongKeDT);

module.exports = router;