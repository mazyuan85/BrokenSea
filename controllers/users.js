const User = require("../models/user");
const Collection = require("../models/collection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerPage = async (req, res) => {
    res.render("users/register", { title: "Register Here", error: "" });
};

const register = async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({username});
    if (existingUser) {
        res.render("users/register", { title: "Register", error: "Username already exists!" });
        return;
    };
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await new User({
        username,
        password: hashedPassword,
        wallets: [{ balance : 0 }]
    });
    await user.save();
    res.redirect("/users/login");
};

const loginPage = async (req, res) => {
    res.render("users/login", { title: "Login Here", error: "" });
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
    req.session.userId = user._id;
    await req.session.save();

    res.redirect("/");
};

const logout = async (req, res) => {
    await req.session.destroy();
    await res.clearCookie("activeWallet");
    res.redirect("/");
};

const walletPage = async (req, res) => {
    const userId = await req.session.userId;
    const user = await User.findById(userId).populate("wallets");
    const wallets = await user.wallets;
    const activeWalletId = await req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
    res.render("users/wallet", { title: "My Wallets", wallets, activeWallet});
};

const walletDeposit = async (req, res) => {
    const userId = await req.session.userId;
    const user = await User.findById(userId).populate("wallets");
    const wallets = user.wallets;
    const activeWalletId = await req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
    const deposit = req.body.balance;
    const walletIndex = user.wallets.findIndex(w => w._id.toString() === req.params.id);
    const wallet = user.wallets[walletIndex];
    wallet.balance += parseInt(deposit);
    await user.save();
    res.render("users/wallet", { title: "My Wallets", wallets, activeWallet });
};

const walletNew = async (req, res) => {
    const userId = await req.session.userId;
    const user = await User.findById(userId);
    const wallets = user.wallets;
    const activeWalletId = await req.cookies.activeWallet;
    const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
    const newWallet = {};
    user.wallets.push(newWallet);
    await user.save();
    res.render("users/wallet", { title: "My Wallets", wallets, activeWallet})
};

const walletActive = async (req, res) => {
    try {
      const activeWalletId = req.body.activeWallet;
      if (activeWalletId) {
        res.cookie("activeWallet", activeWalletId);
      }
      res.redirect("/users/wallet");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving active wallet");
    }
};

const walletItems = async (req, res) => {
    try {
        const userId = await req.session.userId;
        const user = await User.findById(userId).populate("wallets");
        const wallets = user.wallets;
        const activeWalletId = await req.cookies.activeWallet;
        const activeWallet = await user.wallets.find(w => w.id.toString() === activeWalletId);
        const currentWalletId = req.params.id;
        const currentWallet = await Collection.find({ "nfts.wallet" : currentWalletId });
        res.render("users/walletitems", { title: "My Items", wallets, activeWallet, currentWalletId, currentWallet });
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