const pool = require("./pool");

/*------------- PRODUCTS QUERIES ----------------*/
const addProduct = async (product) => {
    await pool.query(`INSERT INTO products (name) VALUES ($1)`, [product.name]);
};

const getAllProducts = async () => {  
    const { rows } = await pool.query("SELECT * FROM products");
 
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

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProductbyId,
    getAllCategories
}