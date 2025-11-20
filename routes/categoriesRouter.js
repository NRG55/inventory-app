const { Router } = require('express');
const controller = require("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", controller.categoriesGet);

module.exports = categoriesRouter;