var express = require('express');
var router = express.Router();
const marketplacesCtrl = require('../controllers/marketplaces');

// router.get('/mint', collectionsCtrl.mintPage);
// router.post('/mint', collectionsCtrl.mintCollection);
// router.delete('/:collectionId/:nftId', collectionsCtrl.burnNft);
router.post('/collections/:collectionId/:nftId/list', marketplacesCtrl.listItem);
// router.get('/:collectionId', collectionsCtrl.collectionPage);
// router.get('/', collectionsCtrl.allCollectionsPage);


module.exports = router;
