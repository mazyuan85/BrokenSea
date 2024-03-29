const Collection = require("../models/collection");
const User = require("../models/user");
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
        const updatePrice = await Marketplace.findOneAndUpdate({nft: nftId}, {$set : { "listedPrice": listedPrice, "isListed": true }});
    }
    res.redirect(`/collections/${collectionId}/${nftId}`);
};

const delistItem = async (req, res) => {
    const { collectionId, nftId } = req.params;
    const delistItem = await Marketplace.findOneAndUpdate({nft: nftId}, {$set : { "listedPrice": 0, "isListed": false }})
    res.redirect(`/collections/${collectionId}/${nftId}`)
};

const buyItem = async (req, res) => {
    const { collectionId, nftId } = req.params;
    const listedItem = await Marketplace.findOne({ nft: nftId});
    const collection = await Collection.findById(collectionId);
    const nft = await collection.nfts.find((nft) => nft._id.toString() === nftId);
    const listedPrice = listedItem.listedPrice;
    const userId = await req.session.userId;
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
        
    if (activeWallet.balance >= listedPrice) {
        const buyerBalance = await User.findOneAndUpdate( { wallets: { $elemMatch: { _id: activeWalletId}}}, {$inc: { "wallets.$.balance": -listedPrice}});
        const sellerBalance = await User.findOneAndUpdate( { wallets: { $elemMatch: { _id: nft.wallet.toString()}}}, {$inc: { "wallets.$.balance": listedPrice}});
        const transactionData = await Marketplace.findOneAndUpdate({nft: nftId}, {$push: { "transactions" : [{"buyer": activeWalletId, "seller": nft.wallet.toString(), "price": listedPrice}]  } });
        const updateOwner = await Collection.findOneAndUpdate({ "nfts._id" : nftId}, {$set : { "nfts.$.wallet": activeWallet._id }});
        const delistItem = await Marketplace.findOneAndUpdate({nft: nftId}, {$set : { "listedPrice": 0, "isListed": false }});
    } 
    res.redirect(`/collections/${collectionId}/${nftId}`);
}    ;

module.exports = {
    listItem,
    delistItem,
    buyItem
};