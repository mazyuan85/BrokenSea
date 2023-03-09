const { User, Wallet } = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registerPage = async (req, res) => {
    await res.render("users/register", { title : "Register Here", error:""})
}

const register = async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne( {username});
    if (existingUser) {
        res.render("users/register", { title: "Register", error: "Username already exists!"})
        return;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
        username,
        password: hashedPassword,
        wallet: { balance : 0}
    });
    await user.save();
    res.redirect("/users/login");
}

const loginPage = async (req, res) => {
    await res.render("users/login", { title : "Login Here", error:"" })
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (!user) {
        res.render("users/login", { title: "Login Here", error: "Username or Password is wrong!"})
        return;
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        res.render("users/login", { title: "Login Here", error: "Username or Password is wrong!"})
        return;
    }
    req.session.userId = user._id;
    res.redirect("/");
}

const logout = async (req, res) => {
    await req.session.destroy();
    res.redirect('/');
}

const walletPage = async (req, res) => {
    const userId = req.session.userId
    const user = await User.findById(userId).populate("wallets");
    const wallets = user.wallets;
    await res.render("users/wallet", { title: "My Wallets", wallets})
}

const walletDeposit = async (req,res) => {
    const deposit = req.body.balance
    const userId = req.session.userId;
    const user = await User.findById(userId).populate("wallets");
    const wallets = user.wallets;
    const walletIndex = user.wallets.findIndex(w => w._id.toString() === req.params.id);
    const wallet = user.wallets[walletIndex];
    wallet.balance += parseInt(deposit);
    await user.save();
    res.render("users/wallet", { title: "My Wallets", wallets})
}

const walletNew = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const newWallet = new Wallet({balance:0});
    user.wallets.push(newWallet);
    await user.save();
    const wallets = user.wallets;
    res.render("users/wallet", { title: "My Wallets", wallets})
}

module.exports = {
    registerPage,
    register,
    loginPage,
    login,
    logout,
    walletPage,
    walletDeposit,
    walletNew
};