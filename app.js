require("dotenv").config();
const express = require('express');
const path = require('node:path');
const app = express();
const indexRouter = require('./routes/indexRouter');
const productRouter = require('./routes/productRouter');
const brandRouter = require('./routes/brandRouter');
const categoryRouter = require('./routes/categoryRouter');
const setCurrentPathToLocals = require('./middlewares/setCurrentPathToLocals')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(setCurrentPathToLocals);

app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/brands", brandRouter);
app.use("/categories", categoryRouter);

app.use((req, res) => {
  res.status(404).render("error", { title: "Page not found", message: "404 Page not found." });
});

app.use((error, req, res, next) => {
  res.status(500).render("error", { title: "Server Error", message: `500 Server error.` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.error("Server error: ", error);
        throw error;
    };
    console.log(`Express app is listening on port ${PORT}`);    
});