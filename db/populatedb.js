const { Client } = require("pg");
require("dotenv").config();

const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR (50) NOT NULL UNIQUE            
            );
    `;

const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR (40) NOT NULL UNIQUE,
                description TEXT    
            );
    `;

const insertProductsData = `
    INSERT INTO products (name)
    VALUES  ('Product 1'),
            ('Product 2'),
            ('Product 3');    
    `;

const insertCategoriesData = `
    INSERT INTO categories (name, description)
    VALUES  ('Furniture', 'Living room seating, tables, chairs, beds, mattresses, and office furniture.'),
            ('Kitchen', 'Cookware, bakeware, tableware, kitchen tools, and appliances like toasters and kettles.'),
            ('Cleaning', 'Vacuum cleaners, cleaning supplies, laundry baskets, and accessories.'),
            ('Outdoor', 'Outdoor furniture, plants, pots, and lawn and garden equipment.'),
            ('Electronics', 'Small appliances, smart home devices, and other electronics. '),           
            ('Textiles', 'Bedding, curtains, blinds, cushions, throws, rugs, and towels.'),
            ('Decoration', 'Wall art, mirrors, statues, candles, artificial plants, and seasonal decor.'),
            ('Lighting', 'Ambient lighting, outdoor lighting, lamps, and smart lighting.');    
    `;

async function main() {
    console.log("Seeding...");
    const client = new Client({
        connectionString:  `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@localhost:5432/inventory`,
    });
    await client.connect();
    await client.query(createProductsTable);
    await client.query(createCategoriesTable);
    await client.query(insertProductsData);
    await client.query(insertCategoriesData);
    await client.end();
    console.log("done");
}

main();