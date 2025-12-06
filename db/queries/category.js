const pool = require("../pool");
const { getProductsByCategoryId } = require("./product");

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

const updateCategory = async (categoryId, categoryObject) => {    
       await pool.query(
            `
            UPDATE categories 
            SET name = $2, description = $3 
            WHERE id = $1;
            `, 
            [categoryId, categoryObject.name, categoryObject.description]
        );
};

const deleteCategorybyId = async (categoryId) => {
    await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);    
};

const getCategoriesAndItsProductsQuantity = async () => {
    const categories = await getAllCategories(); 
    const categoriesAndItsProductsQuantity = await Promise.all(categories.map(async(category) => {
            const productsArray = await getProductsByCategoryId(category.id);

            return {
                id: category.id,
                name: category.name,
                description: category.description,            
                productsQuantity: productsArray.length            
            };
    }));

    return categoriesAndItsProductsQuantity;
};

module.exports = {    
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategorybyId,
    getCategoriesAndItsProductsQuantity
}