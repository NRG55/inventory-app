const db = require("../db/queries");

async function categoriesGet(req, res) {
    const categories = await db.getAllCategories();

    res.render("categories", { title: "Categories", categories: categories });
};

module.exports = {
    categoriesGet
};