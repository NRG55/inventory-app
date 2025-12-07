const { addBrand,
        getBrandById,
        updateBrand,
        deleteBrandbyId,
        getBrandsAndItsProductsQuantity } = require("../db/queries/brand");
const { validationResult, matchedData } = require("express-validator")
const { validateBrand } = require("../validators/validateBrand");

async function brandsAllGet(req, res, next) {
    try {
        const brands = await getBrandsAndItsProductsQuantity();

        res.render("brand/brands", { title: "Brands", brands: brands });
    } catch (error) {
        next(error);
    };    
};

async function addBrandFormGet(req, res) { 
    res.render("brand/brand_new", { title: "Add Brand", brand: {} });
};

const addBrandFormPost = [
    validateBrand,
    async (req, res, next) => {
        const errors = validationResult(req);
          
            if (!errors.isEmpty()) {                

                return res.status(400).render("brand/brand_new", { 
                    title: "Add Brand",
                    brand: req.body,
                    errors: errors.array() 
                });
            };

            const brandObject = matchedData(req);

        try { 
            await addBrand(brandObject);
            res.redirect("/brands", );

        } catch (error) {
            next(error);
        };
}];

async function editBrandFormGet(req, res, next) {
    const id = req.params.id;
    try {
        const brand = await getBrandById(id);    
   
        res.render("brand/brand_edit", { title: "Edit Brand", brand: brand });

    } catch (error) {
        next(error);
    };    
};

const editBrandFormPost = [
    validateBrand,
    async (req, res, next) => {
        const errors = validationResult(req);
        const brand = req.body;
        brand.id = req.params.id;
  
        if (!errors.isEmpty()) {                

            return res.status(400).render("brand/brand_edit", { 
                title: "Edit Brand",
                brand: brand,
                errors: errors.array() 
            });
        };
        
        const brandObject = matchedData(req);
  
        try {
            await updateBrand(brand.id, brandObject);
            res.redirect("/brands");
        
        } catch (error) {
            next(error);
        };
}];

async function deleteBrandPost(req, res, next) {
    const id = req.params.id;

    try {
        await deleteBrandbyId(id);
        res.redirect("/brands");

    } catch (error) {
        next(error);
    };    
};

module.exports = {
    brandsAllGet,
    addBrandFormGet,
    addBrandFormPost,
    editBrandFormGet,
    editBrandFormPost,   
    deleteBrandPost
};