const { Router } = require('express');
const controller = require("../controllers/categoryController");

const categoryRouter = Router();

categoryRouter.get("/", controller.categoriesGet);

module.exports = categoryRouter;