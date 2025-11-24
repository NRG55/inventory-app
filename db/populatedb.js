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
                category_id INTEGER            
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
            ('Kitchen', 'Cookware, bakeware, tableware, kitchen tools, and appliances like toasters and kettles.'),
            ('Cleaning', 'Vacuum cleaners, cleaning supplies, laundry baskets, and accessories.'),
            ('Outdoor', 'Outdoor furniture, plants, pots, and lawn and garden equipment.'),
            ('Electronics', 'Small appliances, smart home devices, and other electronics. '),           
            ('Textiles', 'Bedding, curtains, blinds, cushions, throws, rugs, and towels.'),           
            ('Lighting', 'Ambient lighting, outdoor lighting, lamps, and smart lighting.');    
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
                                category_id: result.categoryId
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