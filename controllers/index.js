const Collection = require("../models/collection");
const User = require("../models/user");

const indexPage = async (req, res) => {
    const allCollections = await Collection.find({});
    
    if (req.session.userId) {
        const userId = await req.session.userId;
        const user = await User.findById(userId).populate("wallets");
        const activeWalletId = await req.cookies.activeWallet;
        const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
        await res.render('index', { title: 'Welcome To BrokenSea', activeWallet, allCollections, userId: req.session.userId });
    } else {
        await res.render('index', { title: 'Welcome To BrokenSea', allCollections });
    }
};

module.exports = {
    indexPage
};