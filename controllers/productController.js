const { getAllProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProductbyId,
        getFilteredProducts } = require("../db/queries/product");
const { getAllCategories,
        getCategoryById } = require("../db/queries/category");

async function productsAllGet(req, res) {      
    const categories = await getAllCategories();
    const isQuery = Object.keys(req.query).length !== 0;    
    let products;

    if (isQuery) {  
        products = await getFilteredProducts(req.query);
    } else {
        products = await getAllProducts(); 
    };        

    res.render("products", { 
        title: "Products", 
        products: products, 
        categories: categories,          
        query: req.query
    });
};

async function addProductFormGet(req, res) { 
    const categories = await getAllCategories();
    res.render("product_new", { title: "Add Product", categories: categories });
};

async function addProductFormPost(req, res) {
    const productObject = req.body;

    await addProduct(productObject);
    res.redirect("/products");
};

async function editProductFormGet(req, res) {
    const id = req.params.id;
    const product = await getProductById(id);
    const category = await getCategoryById(product.category_id)
    const categories = await getAllCategories();

    res.render("product_edit", { title: "Edit product information", product: product, category: category, categories: categories });
};

async function editProductFormPost(req, res) {
    const productId = req.params.id;
    const productData = req.body;

    await updateProduct(productId, productData);
    res.redirect("/products");
};

async function productDetailsGet(req, res) {
    const id = req.params.id;
    const product = await getProductById(id);

    res.render("product_details", { product: product});    
};

async function deleteProductPost(req, res) {
    const id = req.params.id;

    await deleteProductbyId(id);
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