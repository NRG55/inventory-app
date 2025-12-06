const { body } = require('express-validator');

exports.validateProduct = [
    body("name")
        .trim()
        .notEmpty().withMessage("Product name is required.")
        .isLength({ min: 1, max: 50 }).withMessage("Product name must be between 1 and 50 characters."),

    body("sku")
        .optional({ checkFalsy: true })
        .trim()        
        .isLength({ min: 1, max: 20 }).withMessage("SKU must be between 1 and 20 characters."),

    body("price")
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 }).withMessage("Price must be a positive number."),

    body("quantity")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 }).withMessage("Quantity must be a positive number."),

    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage("Description must be maximum 200 characters."),

    body("category_id")
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty().withMessage("Category ID is required."),

    body("brand_id")
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty().withMessage("Brand ID is required."),

    body("image_src")
        .optional({ checkFalsy: true })
        .trim()        
]