const { Client } = require("pg");
const db = require("../db/queries");
require("dotenv").config();

const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR (50) NOT NULL UNIQUE,
                description VARCHAR (200),
                price DECIMAL(6, 2),
                quantity INTEGER,
                sku VARCHAR (20) NOT NULL UNIQUE,
                category_id INTEGER,
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

const insertCategoriesData = `
    INSERT INTO categories (name, description)
    VALUES  ('Furniture', 'Living room seating, tables, chairs, beds, mattresses, and office furniture.'),
            ('Decoration', 'Wall art, mirrors, statues, candles, artificial plants, and seasonal decor.'),
            ('Kitchen', 'Cookware, bakeware, tableware, kitchen tools, and appliances like toasters and kettles.');    
    `;

const ownFetch = async (url, categoryId) => {
    const res = await fetch(url);
    const data = await res.json();

    return { data, categoryId };
};

let requests = [];
let categories = ["furniture", "home-decoration", "kitchen-accessories"];

categories.forEach((category, i) => {
    requests.push(ownFetch(`https://dummyjson.com/products/category/${category}`, i+1));
});

const insertProductsData = async () => {
    const results = await Promise.all(requests);
    // results: {data: {}, categoryId: 1}, {data: {}, categoryId: 2}, ...
    results.forEach((result) => {
        result.data.products.forEach((product) => {
            db.addProduct({   
                            name: product.title, 
                            description: product.description,
                            price: product.price,
                            quantity: product.stock,
                            sku: product.sku,
                            category_id: result.categoryId,
                            image_src: `/images/product-${product.sku}.webp`
                        });                
        });        
    });
};

async function main() {
    console.log("Seeding...");
    const client = new Client({
        connectionString:  `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@localhost:5432/inventory`,
    });
    await client.connect();
    await client.query("DROP TABLE IF EXISTS products, categories;");   
    await client.query(createProductsTable);
    await client.query(createCategoriesTable);
    await client.query(insertCategoriesData);      
   
    await client.end();
    console.log("done");
}

main();
insertProductsData();