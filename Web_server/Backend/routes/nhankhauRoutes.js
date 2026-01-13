const express = require('express');
const router = express.Router();
const nhankhauController = require('../controllers/nhankhauController');

router.get('/canho', nhankhauController.getCanHoWithCount);
router.get('/canho/:maCanHo', nhankhauController.getNhanKhauByCanHo);
router.post('/', nhankhauController.createNhanKhau);
router.put('/:id', nhankhauController.updateNhanKhau);
router.delete('/:id', nhankhauController.deleteNhanKhau);
router.get('/find/:id', nhankhauController.getNhanKhauByMa);
router.get('/', nhankhauController.getAllNhanKhau);
module.exports = router;