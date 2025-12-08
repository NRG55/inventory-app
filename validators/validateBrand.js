const { body } = require('express-validator');

exports.validateBrand = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Brand name is required.")
        .isLength({ max: 20 })
        .withMessage("Brand name must be between 1 and 40 characters."),

    body("contact_details")
        .optional({ values: "falsy" })
        .trim()
        .isEmail().withMessage("Email must be valid (example: username@domain.com)"),
];