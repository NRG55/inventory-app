const { Router } = require('express');
const controller = require("../controllers/productsController");

const productsRouter = Router();

productsRouter.get("/", controller.productsGet);

module.exports = productsRouter;