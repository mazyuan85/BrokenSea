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
    delistItem
};