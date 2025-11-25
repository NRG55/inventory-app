const { Router } = require('express');
const controller = require("../controllers/categoryController");

const router = Router();

router.get("/", controller.categoriesAllGet);
router.get("/new", controller.addCategoryFormGet);
router.post("/new", controller.addCategoryFormPost);
router.get("/edit/:id", controller.editCategoryFormGet);
router.post("/edit/:id", controller.editCategoryFormPost);
router.post("/delete/:id", controller.deleteCategoryPost);

module.exports = router;