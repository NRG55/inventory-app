const db = require("../db/queries");

async function productsAllGet(req, res) {
    const products = await db.getAllProducts();

    res.render("products", { title: "Products", products: products });
};

async function addProductFormGet(req, res) { 
    res.render("forms/product/addProductForm", { title: "Add a product" });
};

async function addProductFormPost(req, res) {
    const productObject = req.body;

    await db.addProduct(productObject);
    res.redirect("/products");
};

async function editProductFormGet(req, res) {
    const id = req.params.id;
    const product = await db.getProductById(id);

    res.render("forms/product/editProductForm", { title: "Edit product information", product: product });
};

async function editProductFormPost(req, res) {
    const id = req.params.id;
    const { name } = req.body;

    await db.updateProduct(id, name);
    res.redirect("/products");
};

async function productDetailsGet(req, res) {
    const id = req.params.id;
    const product = await db.getProductById(id);

    res.render("productDetails", { product: product});    
};

async function deleteProductPost(req, res) {
    const id = req.params.id;

    await db.deleteProductbyId(id);
    res.redirect("/products");
};

module.exports = {
    productsAllGet,
    addProductFormGet,
    addProductFormPost,
    editProductFormGet,
    editProductFormPost,
    productDetailsGet,
    deleteProductPost
};