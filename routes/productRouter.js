const { Router } = require('express');
const controller = require("../controllers/productController");

const router = Router();

router.get("/", controller.productsAllGet);
router.get("/new", controller.addProductFormGet);
router.post("/new", controller.addProductFormPost);
router.get("/edit/:id", controller.editProductFormGet);
router.post("/edit/:id", controller.editProductFormPost);
router.post("/delete/:id", controller.deleteProductPost);

router.get("/:id", controller.productDetailsGet);

module.exports = router;