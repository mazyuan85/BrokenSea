var express = require('express');
var router = express.Router();
const collectionsCtrl = require('../controllers/collections');

router.get('/mint', collectionsCtrl.mintPage);
router.post('/mint', collectionsCtrl.mintCollection);
router.delete('/:collectionId/:nftId', collectionsCtrl.burnNft);
router.get('/:collectionId/:nftId', collectionsCtrl.itemPage);
router.get('/:collectionId', collectionsCtrl.collectionPage);
router.get('/', collectionsCtrl.indexPage);


module.exports = router;
