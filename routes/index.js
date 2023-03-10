var express = require('express');
var router = express.Router();
const indexCtrl = require('../controllers/index');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Welcome To BrokenSea'});
// });

router.get('/', indexCtrl.indexPage);

module.exports = router;
