require("dotenv").config();
const express = require('express');
const path = require('node:path');
const app = express();
const indexRouter = require('./routes/indexRouter');
const productsRouter = require('./routes/productsRouter');
const categoriesRouter = require('./routes/categoriesRouter');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    };
    console.log(`Express app is listening on port ${PORT}`);    
});