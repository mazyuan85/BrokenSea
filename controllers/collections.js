const Collection = require("../models/collection");
const Marketplace = require("../models/marketplace");
const User = require("../models/user");

const allCollectionsPage = async (req, res) => {
  const allCollections = await Collection.find({});
    
  if (req.session.userId) {
    const userId = await req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = await req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
    res.render("collections/all", { title: 'View All Collections', activeWallet, allCollections})
  }
  else {
    res.render("collections/all", { title: 'View All Collections', allCollections})
  }
};

const collectionPage = async (req, res) => {
  const { collectionId } = req.params;
  const collection = await Collection.findById(collectionId);
  const listedItems = await Marketplace.find({
    nft: { $in: collection.nfts.map(nft => nft._id) },
    isListed: true
  });

  const collectionData = collection.toObject();
  const collectionArray = collectionData.nfts.map(nft => {
    return {
      ...nft,
      isListed: false, 
      listedPrice: null 
    };
  });

  listedItems.forEach(listedItem => {
    const index = collectionArray.findIndex(nft => nft._id.equals(listedItem.nft));
    if (index !== -1) {
      collectionArray[index].isListed = listedItem.isListed;
      collectionArray[index].listedPrice = listedItem.listedPrice;
    }
  });

  if (req.session.userId) {
    const userId = await req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = await req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
    res.render("collections/collection", { title:`${collection.name}`, activeWallet, errorMessage: null, collection, listedItems, collectionArray })
  } else {
    res.render("collections/collection", { title:`${collection.name}`, errorMessage: null, collection, listedItems, collectionArray})
  }
};

const itemPage = async (req, res) => {
  const { collectionId, nftId } = req.params;
  const collection = await Collection.findById(collectionId);
  const nft = await collection.nfts.find((nft) => nft._id.toString() === nftId);
  const listedItem = await Marketplace.findOne({ nft: nftId});
  if (listedItem) {
    listedStatus = listedItem.isListed;
    listedPrice = listedItem.listedPrice;
  } else {
    listedStatus = false;
    listedPrice = 0;
  }

  if (req.session.userId) {
    const userId = await req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const activeWalletId = await req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
    res.render("collections/item", {title:`${nft.name}`, activeWallet, errorMessage: null, nft, collection, listedStatus, listedPrice, listedItem})
  } else {
    res.render("collections/item", {title:`${nft.name}`, errorMessage: null, nft, collection, listedStatus, listedPrice, listedItem})  
  }
};

const mintPage = async (req, res) => {
  const userId = await req.session.userId
  const user = await User.findById(userId).populate("wallets");
  const activeWalletId = await req.cookies.activeWallet;
  const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId)
  res.render("collections/mint", {title:"Mint a New Collection", activeWallet, errorMessage: null})
};

const mintCollection = async (req,res) => {
  let { name, imageUrl, description, nftName, nftDescription, nftImageUrl, nftAttributes } = req.body;
  const userId = await req.session.userId;
  const user = await User.findById(userId).populate("wallets");
  const activeWalletId = await req.cookies.activeWallet;
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

    if (!activeWallet) {
      return res.render("collections/mint", {title:"Mint a New Collection", activeWallet, errorMessage: "Select an active wallet first"})
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
      description,
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
};


const burnNft = async (req, res) => {
  const { collectionId, nftId } = req.params;
  const collection = await Collection.findById(collectionId);
  const nft = await collection.nfts.find((nft) => nft._id.toString() === nftId);
  const owner = nft.wallet.toString();
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send("Unauthorised to use burn function");
  }
  const user = await User.findById(userId).populate("wallets");
  const walletsOwned = user.wallets.map(w => w._id.toString());
  if (!walletsOwned.includes(owner)) {
    return res.status(401).send("Unauthorised to use burn function");
  }
  collection.nfts.pull(nftId);
  await collection.save();
  res.redirect(`/users/wallet/${owner}/`);
};

module.exports = {
    mintPage,
    mintCollection,
    allCollectionsPage,
    burnNft,
    itemPage,
    collectionPage
};