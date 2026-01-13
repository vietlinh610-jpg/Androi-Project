const express = require("express");
const router = express.Router();
const guiXeController = require("../controllers/guiXeController");

// route: //.../api/guixe/:id
router.post('/:id', guiXeController.themGuiXe);

// route: //.../api/guixe/xoa/:id
router.delete('/xoa/:id', guiXeController.xoaGuiXe);

// route: //.../api/guixe/dsgx
router.get('/dsgx', guiXeController.layDSGX);

module.exports = router;