const Collection = require("../models/collection");
const { User, Wallet } = require("../models/user");
const Marketplace = require("../models/marketplace");

const listItem = async (req, res) => {
    const { collectionId, nftId } = req.params;
    const { listedPrice } = req.body;
    const listingItem = await Marketplace.findOne({ nft: nftId});
    // first-time listing
    if (!listingItem) {
        const newListing = new Marketplace({
            nft: nftId,
            isListed: true,
            listedPrice,
        })

        await newListing.save();
    // update listing price
    } else {
        const updatePrice = await Marketplace.findOneAndUpdate({nft: nftId}, {$set : { "listedPrice": listedPrice, "isListed": true }})
    }
    await res.redirect(`/collections/${collectionId}/${nftId}`)
}

const delistItem = async (req, res) => {
    const { collectionId, nftId } = req.params;
    const delistItem = await Marketplace.findOneAndUpdate({nft: nftId}, {$set : { "listedPrice": 0, "isListed": false }})
    await res.redirect(`/collections/${collectionId}/${nftId}`)
}

const buyItem = async (req, res) => {
    const { collectionId, nftId } = req.params;
    const listedItem = await Marketplace.findOne({ nft: nftId});
    // const owner = await Collection.findOne({nfts:})
    const collection = await Collection.findById(collectionId);
    const nft = await collection.nfts.find((nft) => nft._id.toString() === nftId);
    const listedPrice = listedItem.listedPrice;
    const userId = req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
        
    if (activeWallet.balance >= listedPrice) {
        const buyerBalance = await User.findOneAndUpdate( { wallets: { $elemMatch: { _id: activeWalletId}}}, {$inc: { "wallets.$.balance": -listedPrice}})
        const sellerBalance = await User.findOneAndUpdate( { wallets: { $elemMatch: { _id: nft.wallet.toString()}}}, {$inc: { "wallets.$.balance": listedPrice}})
        const updateOwner = await Collection.findOneAndUpdate({ "nfts._id" : nftId}, {$set : { "nfts.$.wallet": activeWallet._id }})
        const delistItem = await Marketplace.findOneAndUpdate({nft: nftId}, {$set : { "listedPrice": 0, "isListed": false }});
    } 
    await res.redirect(`/collections/${collectionId}/${nftId}`)
}    
// const indexPage = async (req, res) => {
//     const allCollections = await Collection.find()
    
//     if (req.session.userId) {
//     const userId = req.session.userId
//     const user = await User.findById(userId).populate("wallets");
//     const activeWalletId = req.cookies.activeWallet;
//     const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
//     await res.render('index', { title: 'Welcome To BrokenSea', activeWallet, allCollections})
//     }
//     else {
//         await res.render('index', { title: 'Welcome To BrokenSea', allCollections})
//     }
// }

module.exports = {
    listItem,
    delistItem,
    buyItem
};