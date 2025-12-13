require("dotenv").config();
const { Pool } = require("pg");

module.exports = new Pool({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,       
    port: process.env.DATABASE_PORT,
    ssl: { rejectUnauthorized: false },    
});