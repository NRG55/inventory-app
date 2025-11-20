const pool = require("./pool");

const getAllProducts = async () => {  
    const { rows } = await pool.query("SELECT * FROM products");
 
    return rows;
};

const getAllCategories = async () => {  
    const { rows } = await pool.query("SELECT * FROM categories");
 
    return rows;
};

module.exports = {
    getAllProducts,
    getAllCategories
}