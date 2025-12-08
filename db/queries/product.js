const pool = require("../pool");

const addProduct = async (product) => { 
    await pool.query(`INSERT INTO products (name, description, price, quantity, sku, category_id, brand_id, image_src) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, 
        [
            product.name,
            product.description,
            product.price,
            product.quantity,
            product.sku,
            product.category_id,
            product.brand_id,
            product.image_src
        ]
    );
};

const getAllProducts = async () => {     
    const { rows } = await pool.query(
        `
        SELECT products.*, LOWER(categories.name) AS category, brands.name AS brand 
        FROM products 
        JOIN categories ON category_id = categories.id
        JOIN brands ON brand_id = brands.id;
        `);

    return rows;
};

const getProductById = async (productId) => {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);

    return rows[0];
};

const getProductsByCategoryId = async (categoryId) => {
    const { rows } = await pool.query("SELECT * FROM products WHERE category_id = $1", [categoryId]);

    return rows;
};

const getProductsByBrandId = async (brandId) => {
    const { rows } = await pool.query("SELECT * FROM products WHERE brand_id = $1", [brandId]);

    return rows;
};

const updateProduct = async (productId, productData) => {
    const fieldsArray = []; // columns: id, name, price, ...
    const valuesArray = []; // rows: 1, "Plant Pot", 14.99, ...
    let valuePlaceholder = 1; // $1, $2, $3 ... 

    for (const [field, value] of Object.entries(productData)) {
        fieldsArray.push(`${field} = $${valuePlaceholder++}`);
        valuesArray.push(value);
    }; 
    
    valuesArray.push(productId);
    
    const fieldsString = fieldsArray.join(", ");    
    const sql = `UPDATE products SET ${fieldsString} WHERE id = $${valuePlaceholder};`; 
    
    await pool.query(sql, valuesArray);
};

const deleteProductbyId = async (productId) => {
    await pool.query("DELETE FROM products WHERE id = $1", [productId]);    
};

const getFilteredProducts = async (query) => {
    const valuesArray = []; // node-postgresql parameters that will be inserted into the SQL query
    const categoriesArray =[];
    const brandsArray = [];
    let allPlaceholdersArray = [];  // parameter placeholder (ex: $1, $2) for parameterized query parameteres. Example: VALUES ($1, $2, ...), ["value1", "value2", ...]
    let categoriesPlaceholdersArray = [];
    let brandsPlaceholdersArray = [];    
    let orderByProductNameOrPrice = "";
    let whereCategoriesIn = "";
    let whereBrandsIn = "";
    let productNameLike = "";   

    // if there is more than one category selection - query.category example: {category: [{"furniture"},{"kitchen"},...]}
    if (query.category) {      
        if (Array.isArray(query.category)) {            
            categoriesArray.push(...query.category)
            valuesArray.push(...categoriesArray); // will be passed to a parameterized sql query 
            categoriesPlaceholdersArray = categoriesArray.map((category, index) => "$" + (index + 1));                            
            whereCategoriesIn = ` WHERE categories.name IN(${categoriesPlaceholdersArray})`;
        } else {
            // there is only one category selection - query.category example: {category: "furniture"}            
            categoriesArray.push(query.category);           
            valuesArray.push(query.category); 
            whereCategoriesIn = ` WHERE categories.name IN($1)`;            
            categoriesPlaceholdersArray.push('$1');
        };

        allPlaceholdersArray.push(...categoriesPlaceholdersArray);        
    };  

    if (query.brand) {
        if (Array.isArray(query.brand)) {
            brandsArray.push(...query.brand);
            valuesArray.push(...brandsArray);           
            // there is a multiple brand selection and multiple categories selection
            if (allPlaceholdersArray.length > 0) {
                brandsPlaceholdersArray = brandsArray.map((brand, index) => "$" + (allPlaceholdersArray.length + (index + 1)));
                whereBrandsIn = ` AND brands.name IN (${brandsPlaceholdersArray})`;                
                allPlaceholdersArray.push(...brandsPlaceholdersArray);
            // there is a multiple brand selection and no categories selection                
            } else {   
                brandsPlaceholdersArray = brandsArray.map((brand, index) => "$" + (index + 1));            
                whereBrandsIn = ` WHERE brands.name IN (${brandsPlaceholdersArray})`;
                allPlaceholdersArray.push(...brandsPlaceholdersArray);
            };

        } else {
            // there is only one brand selection and one category selection
            if (valuesArray.length > 0) {
                brandsArray.push(query.brand);
                valuesArray.push(...brandsArray);
                brandsPlaceholdersArray.push(`$${allPlaceholdersArray.length + 1}`)
                whereBrandsIn = ` AND brands.name IN($${allPlaceholdersArray.length + 1})`;
                allPlaceholdersArray.push(...brandsPlaceholdersArray);                 
            } else {
                // there is only one brand selection and no categories selection
                valuesArray.push(query.brand);               
                whereBrandsIn = ` WHERE brands.name IN ($1)`;                
                allPlaceholdersArray.push('$1');  
            };                     
        };       
    };

    if (query.search) {
        valuesArray.push(`%${query.search}%`); 
           
        if (valuesArray.length > 0) {                    
            allPlaceholdersArray.push(`$${valuesArray.length}`);
            // a category is selected so AND clause is used  
            productNameLike = ` AND LOWER(products.name) LIKE LOWER($${valuesArray.length})`;
        } else {             
            allPlaceholdersArray.push("$1");
            // no category selection so WHERE clause is used
            productNameLike = ` WHERE LOWER(products.name) LIKE LOWER($${valuesArray.length})`;
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
    
    let sql = `
        SELECT products.*, categories.name AS category, brands.name AS brand FROM products 
        JOIN categories ON category_id = categories.id
        JOIN brands ON brand_id = brands.id    
    `;
    
    if (whereCategoriesIn) {
       sql += whereCategoriesIn; 
    };

    if (whereBrandsIn) {
        sql += whereBrandsIn;
    };

    if (productNameLike) {
        sql += productNameLike;
    };

    sql += ` ${orderByProductNameOrPrice} `;   

    const { rows } = await pool.query(sql, valuesArray); 

    return rows;
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategoryId,
    getProductsByBrandId,
    addProduct,
    updateProduct,
    deleteProductbyId,
    getFilteredProducts   
}