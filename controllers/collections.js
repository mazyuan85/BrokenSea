const Collection = require("../models/collection");
const { User, Wallet } = require("../models/user");
const mongoose = require("mongoose");

const mintPage = async (req, res) => {
    const userId = req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
    await res.render("collections/mint", {title:"Mint a New Collection", activeWallet, errorMessage: null})
}

const collectionsPage = async (req, res) => {

}

const mintCollection = async (req,res) => {
    let { name, imageUrl, nftName, nftDescription, nftImageUrl, nftAttributes } = req.body;
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
        imageUrl,
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

const itemPage = async (req, res) => {
    const userId = req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)

    const { collectionId, nftId } = req.params;
    const collection = await Collection.findById(collectionId);
    const nft = await collection.nfts.find((nft) => nft._id.toString() === nftId);
    // if (!nft) {
    //   return res.status(404).render('error', { message: 'NFT not found' });
    // }
    await res.render("collections/item", {title:`${nft.name}`, activeWallet, errorMessage: null, nft, collection})
}

const collectionPage = async (req, res) => {
  const userId = req.session.userId
  const user = await User.findById(userId).populate("wallets");
  const activeWalletId = req.cookies.activeWallet;
  const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)

  const { collectionId } = req.params;
  const collection = await Collection.findById(collectionId);
  // const nft = await collection.nfts.find((nft) => nft._id.toString() === nftId);
  // if (!nft) {
  //   return res.status(404).render('error', { message: 'NFT not found' });
  // }
  await res.render("collections/collection", {title:`${collection.name}`, activeWallet, errorMessage: null, collection})
}

const burnNft = async (req, res) => {
    const { collectionId, nftId } = req.params;

    const collection = await Collection.findById(collectionId);
    collection.nfts.pull(nftId);

    await collection.save();
   
    await res.redirect('/users/wallet');
}

module.exports = {
    mintPage,
    mintCollection,
    collectionsPage,
    burnNft,
    itemPage,
    collectionPage
};