const express = require("express");
const router = express.Router();
const ttcnController = require("../controllers/thongTinCaNhanController");

// route: //.../api/ttcn/chinhsua/:id
router.put('/chinhsua/:id', ttcnController.chinhSuaTTCN);

// route: //.../api/ttcn/layttcn/:id
router.get('/layttcn/:id', ttcnController.layTTCN);

// route: //.../api/ttcn/ttchung/:id
router.get('/ttchung/:id', ttcnController.layTTChung);

// route: //.../api/ttcn/ttgd/:id
router.get('/ttgd/:id', ttcnController.layTTGD);

module.exports = router;