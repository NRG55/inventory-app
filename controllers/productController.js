const { getAllProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProductbyId,
        getFilteredProducts } = require("../db/queries/product");
const { getAllCategories,      
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

async function addProductFormGet(req, res, next) {
    try {
        const categories = await getAllCategories();
        const brands = await getAllBrands();

        res.render("product/product_new", { 
            title: "Add Product", 
            categories: categories, 
            brands: brands,
            product: {} 
        });

    } catch (error) {
        next(error);
    };   
};

const addProductFormPost = [
    validateProduct,
    async (req, res, next) => {       
        const errors = validationResult(req);

        try {     
            if (!errors.isEmpty()) {
                const categories = await getAllCategories();
                const brands = await getAllBrands();

                return res.status(400).render("product/product_new", {
                    title: "Add Product",
                    product: req.body,
                    categories: categories, 
                    brands: brands,
                    errors: errors.array()
                });
            };

            const productObject = matchedData(req);

            await addProduct(productObject);
            res.redirect("/products");

        } catch (error) {
            next(error);
        };
    }
];

async function editProductFormGet(req, res, next) {
    try {
        const product = await getProductById(req.params.id);
        const categories = await getAllCategories();
        const brands = await getAllBrands();   

        res.render("product/product_edit", { 
            title: "Edit product information",        
            product: product,      
            categories: categories,      
            brands: brands,      
        });

    } catch (error) {
        next(error);
    };  
};

const editProductFormPost = [
    validateProduct,
    async (req, res, next) => {       
        const errors = validationResult(req);
        const product = req.body;
        product.id = req.params.id;
        
        try {    
            if (!errors.isEmpty()) {
                const categories = await getAllCategories();
                const brands = await getAllBrands();                    

                return res.status(400).render("product/product_edit", {
                    title: "Edit product information",
                    product: product,              
                    categories: categories, 
                    brands: brands,
                    errors: errors.array()                
                });
            };
        
            const productData = matchedData(req);        

            await updateProduct(product.id, productData);
            res.redirect("/products");

        } catch (error) {
            next(error);
        };
    }
];

async function productDetailsGet(req, res, next) {    
    const id = req.params.id;

    try {
        const product = await getProductById(id);   

        res.render("product/product_details", { product: product });    

    } catch (error) {
        next(error);
    };    
};

async function deleteProductPost(req, res, next) {
    const id = req.params.id;
    try {
        await deleteProductbyId(id);
        res.redirect("/products");

    } catch (error) {
        next(error);
    };    
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