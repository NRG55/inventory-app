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

const getFilteredProducts = async (query) => {
     let sql = `
            SELECT products.*, categories.name AS category FROM products 
            JOIN categories ON category_id = categories.id    
        `;

    const valuesArray = []; // node-postgresql parameters that will be inserted into the SQL query
    let parametersPlaceholders = [];  // parameterPlaceholder (ex: $1, $2) for parameterized query parameteres. Example: VALUES ($1, $2, ...), ["value1", "value2", ...]
    let orderByProductNameOrPrice = "";
    let whereCategoriesIn = "";
    let productNameLike = "";    

    // if there is more than one category selection - query.category example: {category: [{"furniture"},{"kitchen"},...]}
    if (query.category) {
        if (Array.isArray(query.category)) {
            const categoriesArray = query.category;

            valuesArray.push(...categoriesArray); // will be passed to a parameterized sql query           
            parametersPlaceholders = categoriesArray.map((category, index) => "$" + (index + 1));            
            whereCategoriesIn = ` WHERE categories.name IN (${parametersPlaceholders})`;
        } else {
            // there is only one category selection - query.category example: {category: "furniture"}
            valuesArray.push(query.category); // will be passed to a parameterized sql query
            whereCategoriesIn = ` WHERE categories.name IN ($1)`;
        };
    };

    if (query.search) {
        valuesArray.push(`%${query.search}%`);      
        if (valuesArray.length > 1) {                    
            parametersPlaceholders.push(`$${valuesArray.length}`);
            // a category is selected so AND clause is used  
            productNameLike = `AND LOWER(products.name) LIKE LOWER($${valuesArray.length})`;
        } else {             
            parametersPlaceholders.push("$1");
            // no category selection so WHERE clause is used
            productNameLike = `WHERE LOWER(products.name) LIKE LOWER($${valuesArray.length})`;
        };
    };

    switch (query.sort) {       
        case "name_asc":
            orderByProductNameOrPrice = "ORDER BY products.name ASC;";
            break;

        case "name_desc":
            orderByProductNameOrPrice = "ORDER BY products.name DESC;";
            break;

        case "price_asc":
            orderByProductNameOrPrice = "ORDER BY products.price ASC;";
            break;

        case "price_desc":
            orderByProductNameOrPrice = "ORDER BY products.price DESC;";
            break;
    }; 
    
    if (whereCategoriesIn) {
       sql += whereCategoriesIn; 
    };

    if (productNameLike) {
        sql += productNameLike;
    };

    sql += ` ${orderByProductNameOrPrice} `;   
    
    const { rows } = await pool.query(sql, valuesArray);   
    return rows;
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
    getFilteredProducts,
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategorybyId
}