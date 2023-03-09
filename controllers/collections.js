const Collections = require("../models/collection");
const { User, Wallet } = require("../models/user");

const mintPage = async (req,res) => {
    const userId = req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
    await res.render("./collections/mint", {title:"Mint a New Collection", activeWallet})
}

const mintCollection = async (req,res) => {

}

module.exports = {
    mintPage,
    mintCollection
};