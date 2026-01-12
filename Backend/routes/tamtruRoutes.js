const express = require('express');
const router = express.Router();
const tamtruController = require('../controllers/tamtruController');

router.get('/', tamtruController.getListTamTru);
router.post('/', tamtruController.createTamTru);
router.put('/:id', tamtruController.updateTamTru);
router.delete('/:id', tamtruController.deleteTamTru);
module.exports = router;