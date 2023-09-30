//External imports
const { check, validationResult } = require("express-validator");

const loginValidator = [
    check("username").isLength({ min: 1 }).withMessage("Mobile number or email is required"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

const loginValidatorHandler = (req, res, next) => {
    const errors = validationResult(req);

    const mappedError = errors.mapped();
    /*mappedError = {
        name: {
            msg: "Name is required"
        },
        email: {
            msg: "Invalid email address"
        },
    }*/
    //here Object means mappedError and keys means name, email, and more
    if (Object.keys(mappedError).length === 0) {
        next();
    } else {
        //if file upload but validation failed then remove the file. file should be in req.file
        res.render("inbox", {
            data: {
                username: req.body.username,
            },
            errors: mappedError,
        });
    }
};

module.exports = { loginValidator, loginValidatorHandler };
