const express = require("express");
const router = express.Router();
const khoanThuController = require("../controllers/khoanThuController");

// Route : //.../api/khoan-thu
router.post("/", khoanThuController.taoKhoanThu);
router.get("/", khoanThuController.layKhoanThu);

module.exports = router;