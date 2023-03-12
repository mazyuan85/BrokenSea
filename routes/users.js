var express = require('express');
var router = express.Router();
const usersCtrl = require('../controllers/users');

router.get('/register', usersCtrl.registerPage);
router.post('/register', usersCtrl.register);
router.get('/login', usersCtrl.loginPage);
router.post('/login', usersCtrl.login);
router.post('/logout', usersCtrl.logout);
router.get('/wallet', usersCtrl.walletPage);
router.post('/wallet/new', usersCtrl.walletNew);
router.post('/wallet', usersCtrl.walletActive);
router.post('/wallet/:id/deposit', usersCtrl.walletDeposit);
router.post('/wallet/:id', usersCtrl.walletItems);
router.get('/wallet/:id', usersCtrl.walletItems);

module.exports = router;