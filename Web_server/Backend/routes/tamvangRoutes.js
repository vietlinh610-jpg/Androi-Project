const express = require('express');
const router = express.Router();
const tamvangController = require('../controllers/tamvangController');

router.get('/', tamvangController.getListTamVang);
router.post('/', tamvangController.createTamVang);
router.put('/:id', tamvangController.updateTamVang);
router.delete('/:id', tamvangController.deleteTamVang);
module.exports = router;