const db = require("../db/queries");

async function productsAllGet(req, res) {
     const inputsSortBy = [
        {name: "sort", value: "price_asc", labelText: "Price Low to High"},
        {name: "sort", value: "price_desc", labelText: "Price High to Low"},
        {name: "sort", value: "name_asc", labelText: "Product A to Z"},
        {name: "sort", value: "name_desc", labelText: "Product Z to A"}
    ];
    
    const categories = await db.getAllCategories();

    const isQuery = Object.keys(req.query).length !== 0;
    console.log(req.query)
    if (isQuery) {
        const products = await db.getFilteredProducts(req.query);         

        res.render("products", { 
            title: "Products", 
            products: products, 
            categories: categories,
            inputsSortBy: inputsSortBy,
            selectedCategories: req.query.category,
            sort: req.query.sort
        });

        return;
    };

    const products = await db.getAllProducts();     

    res.render("products", { 
        title: "Products", 
        products: products, 
        categories: categories,
        inputsSortBy: inputsSortBy
    });
};

async function addProductFormGet(req, res) { 
    const categories = await db.getAllCategories();
    res.render("product_new", { title: "Add Product", categories: categories  });
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