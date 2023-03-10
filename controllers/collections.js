const Collection = require("../models/collection");
const { User, Wallet } = require("../models/user");
const mongoose = require("mongoose");

const mintPage = async (req,res) => {
    const userId = req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
    await res.render("./collections/mint", {title:"Mint a New Collection", activeWallet, errorMessage: null})
}

const mintCollection = async (req,res) => {
    let { name, nftName, nftDescription, nftImageUrl, nftAttributes } = req.body;
    const userId = req.session.userId;
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
  
    try {
      const user = await User.findById(userId);
      const nfts = [];
      
      // Convert strings to arrays if there's only 1 nft in the collection
      if (typeof nftName === "string") {
        nftName = nftName.split("|");
        nftDescription = nftDescription.split("|");
        nftImageUrl = nftImageUrl.split("|");
        nftAttributes = nftAttributes.split("|");
      }

      if (!nftName) {
        return res.render("collections/mint", {title:"Mint a New Collection", activeWallet, errorMessage: "Please add at least one NFT"})
      }

      for (let i = 0; i < nftName.length; i++) {
        const newNft = {
          name: nftName[i],
          description: nftDescription[i],
          imageUrl: nftImageUrl[i],
          attributes: nftAttributes[i],
          wallet: activeWallet._id
        };
  
        nfts.push(newNft);
      }
  
      const newCollection = new Collection({
        name,
        creator: user,
        nfts
      });
  
      await newCollection.save();
      res.redirect("/collections/mint")
    } catch (err) {
      console.error(err);
      res.status(500).send("Error minting collection" + err.message);
    }
}

module.exports = {
    mintPage,
    mintCollection
};