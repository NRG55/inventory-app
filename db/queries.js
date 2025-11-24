const pool = require("./pool");

/*------------- PRODUCTS QUERIES ----------------*/
const addProduct = async (product) => {
    await pool.query(`INSERT INTO products (name, description, price, quantity, category_id) VALUES ($1, $2, $3, $4, $5)`, 
        [
            product.name,
            product.description,
            product.price,
            product.quantity,
            product.category_id
        ]
    );
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