const pool = require("../pool");
const { getProductsByBrandId } = require("./product");

const getAllBrands = async () => {  
    const { rows } = await pool.query("SELECT * FROM brands");
 
    return rows;
};

const addBrand = async (brand) => {
    await pool.query(`INSERT INTO brands (name, contact_details) VALUES ($1, $2)`, 
        [
            brand.name,
            brand.contact_details           
        ]
    );
};

const getBrandById = async (brandId) => {
    const { rows } = await pool.query("SELECT * FROM brands WHERE id = $1", [brandId]);

    return rows[0];
};

const updateBrand = async (brandId, brandObject) => {     
    await pool.query(
        `
        UPDATE brands 
        SET name = $2, contact_details = $3 
        WHERE id = $1;
        `, 
        [brandId, brandObject.name, brandObject.contact_details]
    );
};

const deleteBrandbyId = async (brandId) => {
    await pool.query("DELETE FROM brands WHERE id = $1", [brandId]);    
};

const getBrandsAndItsProductsQuantity = async () => {
    const brands = await getAllBrands();
    const brandsAndItsProductsQuantity = await Promise.all(brands.map(async(brand) => {
            const productsArray = await getProductsByBrandId(brand.id);

            return {
                id: brand.id,
                name: brand.name,
                contact_details: brand.contact_details,            
                productsQuantity: productsArray.length            
            };
    }));

    return brandsAndItsProductsQuantity;
};

module.exports = {    
    getAllBrands,
    addBrand,
    getBrandById,
    updateBrand,
    deleteBrandbyId,
    getBrandsAndItsProductsQuantity
}