const { getAllProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProductbyId,
        getFilteredProducts } = require("../db/queries/product");
const { getAllCategories,
        getCategoryById,
        getCategoriesAndItsProductsQuantity } = require("../db/queries/category");
const { getAllBrands,     
        getBrandsAndItsProductsQuantity } = require("../db/queries/brand");
const { validationResult, matchedData } = require("express-validator")
const { validateProduct } = require("../validators/validateProduct");

async function productsAllGet(req, res, next) {
    try {
        const brandsAndItsProductsQuantity = await getBrandsAndItsProductsQuantity();   
        const categoriesAndItsProductsQuantity = await getCategoriesAndItsProductsQuantity();
        const isQuery = Object.keys(req.query).length !== 0;    
        let products;
        
        if (isQuery) {       
            products = await getFilteredProducts(req.query);
        } else {
            products = await getAllProducts(); 
        };        

        res.render("product/products", { 
            title: "Products", 
            products: products,
            brands: brandsAndItsProductsQuantity, 
            categories: categoriesAndItsProductsQuantity,          
            query: req.query,
            url: req.url                
        });        
    } catch (error) {
        next(error); // Forward error to the global error handler
    };   
};

async function addProductFormGet(req, res) { 
    const categories = await getAllCategories();
    const brands = await getAllBrands();

    res.render("product/product_new", { title: "Add Product", categories: categories, brands: brands });
};

const addProductFormPost = [
    validateProduct,
    async (req, res) => {
       
        const errors = validationResult(req);
         console.log(errors)
        if (!errors.isEmpty()) {
            const categories = await getAllCategories();
            const brands = await getAllBrands();

            return res.status(400).render("product/product_new", {
                title: "Add Product",
                categories: categories, 
                brands: brands,
                errors: errors.array(),
            });
        };

        const productObject = matchedData(req);

        await addProduct(productObject);
        res.redirect("/products");
    }
];

async function editProductFormGet(req, res) {
    const id = req.params.id;
    const product = await getProductById(id);
    const category = await getCategoryById(product.category_id);
    const categories = await getAllCategories();
    const brands = await getAllBrands();
    const brand = await getCategoryById(product.category_id);

    res.render("product/product_edit", { 
        title: "Edit product information", 
        product: product, 
        category: category, 
        categories: categories,
        brand: brand,
        brands: brands 
    });
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

    res.render("product/product_details", { product: product });    
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