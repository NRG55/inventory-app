const pool = require("./pool");

/*------------- PRODUCTS QUERIES ----------------*/
const addProduct = async (product) => {
    await pool.query(`INSERT INTO products (name, description, price, quantity, sku, category_id, image_src) VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
        [
            product.name,
            product.description,
            product.price,
            product.quantity,
            product.sku,
            product.category_id,
            product.image_src
        ]
    );
};

const getAllProducts = async () => {  
    const { rows } = await pool.query(
        "SELECT products.*, LOWER(categories.name) AS category FROM products JOIN categories ON category_id = categories.id");
 
    return rows;
};

const getProductById = async (productId) => {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);

    return rows[0];
};

const updateProduct = async (id, name) => {    
    await pool.query("UPDATE products SET name = $2 WHERE id = $1", [id, name]);
};

const deleteProductbyId = async (productId) => {
    await pool.query("DELETE FROM products WHERE id = $1", [productId]);    
};

/*------------ CATEGORIES QUERIES ---------------*/

const getAllCategories = async () => {  
    const { rows } = await pool.query("SELECT * FROM categories");
 
    return rows;
};

const addCategory = async (category) => {
    await pool.query(`INSERT INTO categories (name, description) VALUES ($1, $2)`, 
        [
            category.name,
            category.description,           
        ]
    );
};

const getCategoryById = async (categoryId) => {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [categoryId]);

    return rows[0];
};

const updateCategory = async (id, name) => {    
    await pool.query("UPDATE categories SET name = $2 WHERE id = $1", [id, name]);
};

const deleteCategorybyId = async (categoryId) => {
    await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);    
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProductbyId,
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategorybyId
}