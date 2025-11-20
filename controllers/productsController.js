const db = require("../db/queries");

async function productsGet(req, res) {
    const products = await db.getAllProducts();

    res.render("products", { title: "Products", products: products });
};

module.exports = {
    productsGet
};