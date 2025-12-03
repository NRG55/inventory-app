const { getAllCategories,
        addCategory,
        getCategoryById,
        updateCategory,
        deleteCategorybyId } = require("../db/queries/category");
const { getFilteredProducts } = require("../db/queries/product");

async function categoriesAllGet(req, res) {
    const categories = await getAllCategories();
  
    const updatedCategories = await Promise.all(categories.map(async(category) => {
            const productsArray = await getFilteredProducts({ category: category.name });        
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            productsQuantity: productsArray.length            
        }
    }));

    res.render("category/categories", { title: "Categories", categories: updatedCategories });
};

async function addCategoryFormGet(req, res) { 
    res.render("category/category_new", { title: "Add Category" });
};

async function addCategoryFormPost(req, res) {
    const categoryObject = req.body;

    await addCategory(categoryObject);
    res.redirect("/categories", );
};

async function editCategoryFormGet(req, res) {
    const id = req.params.id;
    const category = await getCategoryById(id);    
   
    res.render("category/category_edit", { title: "Edit Category", category: category });
};

async function editCategoryFormPost(req, res) {
    const id = req.params.id;
    const { name } = req.body;

    await updateCategory(id, name);
    res.redirect("/categories");
};

async function deleteCategoryPost(req, res) {
    const id = req.params.id;

    await deleteCategorybyId(id);
    res.redirect("/categories");
};

module.exports = {
    categoriesAllGet,
    addCategoryFormGet,
    addCategoryFormPost,
    editCategoryFormGet,
    editCategoryFormPost,   
    deleteCategoryPost
};