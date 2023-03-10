const Collection = require("../models/collection");
const { User, Wallet } = require("../models/user");

const indexPage = async (req, res) => {
    const allCollections = await Collection.find()
    
    if (req.session.userId) {
    const userId = req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
    await res.render('index', { title: 'Welcome To BrokenSea', activeWallet, allCollections})
    }
    else {
        await res.render('index', { title: 'Welcome To BrokenSea', allCollections})
    }
}

module.exports = {
    indexPage
};