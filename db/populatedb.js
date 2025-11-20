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
                name VARCHAR (20) NOT NULL UNIQUE    
            );
    `;

const insertProductsData = `
    INSERT INTO products (name)
    VALUES  ('Product 1'),
            ('Product 2'),
            ('Product 3');    
    `;

const insertCategoriesData = `
    INSERT INTO categories (name)
    VALUES  ('Category 1'),
            ('Category 2'),
            ('Category 3');    
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