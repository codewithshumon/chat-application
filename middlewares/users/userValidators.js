//External imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");
//External imports
const User = require("../../models/People");

const addUserValidator = [
    check("name")
        .isLength({ min: 1 })
        .withMessage("Name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name must not contain anyother then alphabet")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        //custom validator to check if the email already exist
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    // this error don't direct to express err middleware.Its direct to next mid
                    throw createError("Email is already used!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),

    check("mobile")
        .isMobilePhone("bn-BD", {
            strictMode: true,
        })
        .withMessage("Must be a valid Bangladeshi mobile number")
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value });
                if (user) {
                    // this error don't direct to express err middleware.Its direct to next mid
                    throw createError("Mobile number is already used!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters and contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol",
        )
        .trim(),
];

const addUserValidatorHandler = (req, res, next) => {
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
        if (req.files.length > 0) {
            //if file uploaded there would be only one file
            const { filename } = req.files[0]; // Corrected this line
            fs.unlink(path.join(__dirname, `../../public/uploads/avatars/${filename}`), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        res.status(500).json({
            errors: mappedError,
        });
    }
};

module.exports = { addUserValidator, addUserValidatorHandler };
