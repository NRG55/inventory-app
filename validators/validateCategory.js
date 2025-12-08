const { body } = require('express-validator');

exports.validateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ max: 20 })
        .withMessage("Category name must be between 1 and 20 characters."),

    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage("Description must be maximum 200 characters."),
];