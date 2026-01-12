const express = require("express");
const router = express.Router();
const ktKhoanThuController = require("../controllers/KTKhoanThuController");

// Route: //.../api/kt-khoanthu
router.get("/", ktKhoanThuController.kiemTraThuPhi);

// Route : //.../api/kt-khoanthu/xacnhan
router.post("/xacnhan/:id", ktKhoanThuController.xacNhanThuPhi);

// Route : //.../api/kt-khoanthu/tuchoi
router.post("/tuchoi/:id", ktKhoanThuController.tuChoiKhoanThu);

module.exports = router;