var express = require('express');
var router = express.Router();
const indexCtrl = require('../controllers/index');

router.get('/', indexCtrl.indexPage);

module.exports = router;
