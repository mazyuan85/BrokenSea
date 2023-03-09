const Collections = require("../models/collection");

const mintPage = async (req,res) => {
    await res.render("./collections/mint", {title:"Mint a New Collection"})
}

module.exports = {
    mintPage
};