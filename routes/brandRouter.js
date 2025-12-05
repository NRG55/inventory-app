const { Router } = require('express');
const controller = require("../controllers/brandController");

const router = Router();

router.get("/", controller.brandsAllGet);
router.get("/new", controller.addBrandFormGet);
router.post("/new", controller.addBrandFormPost);
router.get("/edit/:id", controller.editBrandFormGet);
router.post("/edit/:id", controller.editBrandFormPost);
router.post("/delete/:id", controller.deleteBrandPost);

module.exports = router;