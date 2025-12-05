const { addBrand,
        getBrandById,
        updateBrand,
        deleteBrandbyId,
        getBrandsAndItsProductsQuantity } = require("../db/queries/brand");

async function brandsAllGet(req, res) {
    const brands = await getBrandsAndItsProductsQuantity();

    res.render("brand/brands", { title: "Brands", brands: brands });
};

async function addBrandFormGet(req, res) { 
    res.render("brand/brand_new", { title: "Add Brand" });
};

async function addBrandFormPost(req, res) {
    const brandObject = req.body;

    await addBrand(brandObject);
    res.redirect("/brands", );
};

async function editBrandFormGet(req, res) {
    const id = req.params.id;
    const brand = await getBrandById(id);    
   
    res.render("brand/brand_edit", { title: "Edit Brand", brand: brand });
};

async function editBrandFormPost(req, res) {
    const brandId = req.params.id;
    const brandObject = req.body;   

    await updateBrand(brandId, brandObject);
    res.redirect("/brands");
};

async function deleteBrandPost(req, res) {
    const id = req.params.id;

    await deleteBrandbyId(id);
    res.redirect("/brands");
};

module.exports = {
    brandsAllGet,
    addBrandFormGet,
    addBrandFormPost,
    editBrandFormGet,
    editBrandFormPost,   
    deleteBrandPost
};