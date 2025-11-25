const db = require("../db/queries");

async function categoriesAllGet(req, res) {
    const categories = await db.getAllCategories();

    res.render("categories", { title: "Categories", categories: categories });
};

async function addCategoryFormGet(req, res) { 
    res.render("category_new", { title: "Add Category" });
};

async function addCategoryFormPost(req, res) {
    const categoryObject = req.body;

    await db.addCategory(categoryObject);
    res.redirect("/categories");
};

async function editCategoryFormGet(req, res) {
    const id = req.params.id;
    const category = await db.getCategoryById(id);

    res.render("category_edit", { title: "Edit Category", category: category });
};

async function editCategoryFormPost(req, res) {
    const id = req.params.id;
    const { name } = req.body;

    await db.updateCategory(id, name);
    res.redirect("/categories");
};

async function deleteCategoryPost(req, res) {
    const id = req.params.id;

    await db.deleteCategorybyId(id);
    res.redirect("/categories");
};

module.exports = {
    categoriesAllGet,
    addCategoryFormGet,
    addCategoryFormPost,
    editCategoryFormGet,
    editCategoryFormPost,   
    deleteCategoryPost
};