const db = require("../db/queries");

async function productsAllGet(req, res) {      
    const categories = await db.getAllCategories();
    const isQuery = Object.keys(req.query).length !== 0;    
    let products;

    if (isQuery) {  
        products = await db.getFilteredProducts(req.query);
    } else {
        products = await db.getAllProducts(); 
    };        

    res.render("products", { 
        title: "Products", 
        products: products, 
        categories: categories,          
        query: req.query
    });
};

async function addProductFormGet(req, res) { 
    const categories = await db.getAllCategories();
    res.render("product_new", { title: "Add Product", categories: categories });
};

async function addProductFormPost(req, res) {
    const productObject = req.body;

    await db.addProduct(productObject);
    res.redirect("/products");
};

async function editProductFormGet(req, res) {
    const id = req.params.id;
    const product = await db.getProductById(id);

    res.render("product_edit", { title: "Edit product information", product: product });
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

    res.render("product_details", { product: product});    
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