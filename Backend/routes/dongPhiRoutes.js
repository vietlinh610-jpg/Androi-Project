const express = require("express");
const router = express.Router();
const dongPhiController = require("../controllers/dongPhiController");

// route: //.../api/dongphi/dskt/:id
router.get('/dskt/:id', dongPhiController.layDSKT);

// route: //.../api/dongphi/noptien
router.post('/noptien', dongPhiController.dongPhi);

// route: //.../api/dongphi/lstt/:id
router.get('/lstt/:id', dongPhiController.lichsuTT);

module.exports = router;
