const { addCategory,
        getCategoryById,
        updateCategory,
        deleteCategorybyId,
        getCategoriesAndItsProductsQuantity } = require("../db/queries/category");
const { validationResult, matchedData } = require("express-validator")
const { validateCategory } = require("../validators/validateCategory");

async function categoriesAllGet(req, res, next) {
    try {
        const categories = await getCategoriesAndItsProductsQuantity();

        res.render("category/categories", { title: "Categories", categories: categories });
    } catch (error) {
        next(error);
    };    
};

async function addCategoryFormGet(req, res) { 
    res.render("category/category_new", { title: "Add Category", category: {} });
};

const addCategoryFormPost = [
    validateCategory,
    async (req, res, next) => {
        const errors = validationResult(req);
          
            if (!errors.isEmpty()) {                

                return res.status(400).render("category/category_new", { 
                    title: "Add Category",
                    category: req.body,
                    errors: errors.array() 
                });
            };

            const categoryObject = matchedData(req);

        try { 
            await addCategory(categoryObject);
            res.redirect("/categories", );

        } catch (error) {
            next(error);
        };
}];

async function editCategoryFormGet(req, res, next) {
    const id = req.params.id;
    try {
        const category = await getCategoryById(id);    
   
        res.render("category/category_edit", { title: "Edit Category", category: category });

    } catch (error) {
        next(error);
    };    
};

const editCategoryFormPost = [
    validateCategory,
    async (req, res, next) => {
        const errors = validationResult(req);
        const category = req.body;
        category.id = req.params.id;
     
        if (!errors.isEmpty()) {                

            return res.status(400).render("category/category_edit", { 
                title: "Edit Category",
                category: category,
                errors: errors.array() 
            });
        };
           
        const categoryObject = matchedData(req);

        try {
            await updateCategory(category.id, categoryObject);
            res.redirect("/categories");
        
        } catch (error) {
            next(error);
        };
}];

async function deleteCategoryPost(req, res, next) {
    const id = req.params.id;

    try {
        await deleteCategorybyId(id);
        res.redirect("/categories");

    } catch (error) {
        next(error);
    };    
};

module.exports = {
    categoriesAllGet,
    addCategoryFormGet,
    addCategoryFormPost,
    editCategoryFormGet,
    editCategoryFormPost,   
    deleteCategoryPost
};