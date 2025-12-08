const { Client } = require("pg");
const products = require("./data/products");
const categories= require("./data/categories");
const brands = require("./data/brands");
require("dotenv").config();

const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR (50) NOT NULL UNIQUE,
                sku VARCHAR (20),
                price NUMERIC(6,2),
                quantity INTEGER,
                description VARCHAR (200),                
                category_id INTEGER,
                brand_id INTEGER,
                image_src TEXT            
            );
    `;

const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR (40) NOT NULL UNIQUE,
                description TEXT    
            );
    `;

const createBrandsTable = `
    CREATE TABLE IF NOT EXISTS brands (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR (40) NOT NULL UNIQUE,
                contact_details TEXT    
            );
    `;

const client = new Client({ connectionString: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${process.env.PORT}/${process.env.DATABASE_NAME}`, ssl: { rejectUnauthorized: true },});

async function resetTables() {
    await client.query("DROP TABLE IF EXISTS products, categories, brands;");
    console.log("Tables dropped");
};

async function createTables() {
    await client.query(createProductsTable);
    await client.query(createCategoriesTable);
    await client.query(createBrandsTable);
    console.log("Tables created");
};

async function insertProducts() {
    for (const product of products) {
        await client.query(
            `
            INSERT INTO products (name, description, price, quantity, sku, category_id, brand_id, image_src)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `, 
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
    console.log("Products data is inserted");
};

async function insertCategories() {
    for (const category of categories) {
        await client.query(
            `
            INSERT INTO categories (name, description) VALUES ($1, $2)
            `, 
            [category.name, category.description]
        );
    };
    console.log("Categories data is inserted");
};

async function insertBrands() {
    for (const brand of brands) {
        await client.query(
            `
            INSERT INTO brands (name, contact_details) VALUES ($1, $2)
            `, 
            [brand.name, brand.contact_details]
        );
    };
    console.log("Brands data is inserted");
};

async function insertData() {
    await insertProducts();
    await insertCategories();
    await insertBrands();
    console.log("All data is inserted");
};

async function main() {
    console.log("Seeding..."); 
    try {
        await client.connect();
        await resetTables();
        await createTables();
        await insertData();
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
        console.log("done");
    }   
};

main();
