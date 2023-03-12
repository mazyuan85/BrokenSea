const User = require("../models/user");
const Collection = require("../models/collection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerPage = async (req, res) => {
    await res.render("users/register", { title: "Register Here", error: "" });
};

const register = async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({username});
    if (existingUser) {
        res.render("users/register", { title: "Register", error: "Username already exists!" });
        return;
    };
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
        username,
        password: hashedPassword,
        wallet: { balance : 0 }
    });
    await user.save();
    res.redirect("/users/login");
};

const loginPage = async (req, res) => {
    await res.render("users/login", { title: "Login Here", error: "" });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (!user) {
        res.render("users/login", { title: "Login Here", error: "Username or Password is wrong!" });
        return;
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        res.render("users/login", { title: "Login Here", error: "Username or Password is wrong!" });
        return;
    }
    // assume potential security issue here but to what level do we need to secure our project?
    req.session.userId = user._id;
    res.redirect("/");
};

const logout = async (req, res) => {
    await req.session.destroy();
    res.clearCookie("activeWallet");
    res.redirect("/");
};

const walletPage = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId).populate("wallets");
    const wallets = user.wallets;
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
    await res.render("users/wallet", { title: "My Wallets", wallets, activeWallet});
};

const walletDeposit = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId).populate("wallets");
    const wallets = user.wallets;
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
    const deposit = req.body.balance;
    const walletIndex = user.wallets.findIndex(w => w._id.toString() === req.params.id);
    const wallet = user.wallets[walletIndex];
    wallet.balance += parseInt(deposit);
    await user.save();
    await res.render("users/wallet", { title: "My Wallets", wallets, activeWallet });
};

const walletNew = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const wallets = user.wallets;
    const activeWalletId = req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
    const newWallet = {};
    user.wallets.push(newWallet);
    await user.save();
    await res.render("users/wallet", { title: "My Wallets", wallets, activeWallet})
};

const walletActive = async (req, res) => {
    try {
      const activeWalletId = req.body.activeWallet;
      if (activeWalletId) {
        res.cookie("activeWallet", activeWalletId);
      }
      await res.redirect("/users/wallet");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving active wallet");
    }
};

const walletItems = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId).populate("wallets");
        const wallets = user.wallets;
        const activeWalletId = req.cookies.activeWallet;
        const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
        const currentWalletId = req.params.id;
        const currentWallet = await Collection.find({ "nfts.wallet" : currentWalletId });
        await res.render("users/walletitems", { title: "My Items", wallets, activeWallet, currentWalletId, currentWallet });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving wallet items");
    }
};

module.exports = {
    registerPage,
    register,
    loginPage,
    login,
    logout,
    walletPage,
    walletDeposit,
    walletNew,
    walletActive,
    walletItems
};