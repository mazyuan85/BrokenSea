var express = require('express');
var router = express.Router();
const marketplacesCtrl = require('../controllers/marketplaces');

router.post('/collections/:collectionId/:nftId/list', marketplacesCtrl.listItem);
router.post('/collections/:collectionId/:nftId/delist', marketplacesCtrl.delistItem);
router.post('/collections/:collectionId/:nftId/buy', marketplacesCtrl.buyItem);

module.exports = router;
