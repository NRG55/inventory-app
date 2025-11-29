const pool = require("../pool");

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
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategorybyId
}