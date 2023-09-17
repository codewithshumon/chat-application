//externatl import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createErroor = require("http-errors");

//internal import
const User = require("../models/People");

// get login page
function getLogin(req, res, next) {
    res.render("index");
}

//do login

async function login(req, res, next) {
    try {
        //finding the user with mobile or email
        const user = await User.findOne({
            // index.ejs input filed name username. thats why req.body.username
            $or: [{ email: req.body.username }, { mobile: req.body.username }],
        });

        if (user && user._id) {
            //compare the user.password with the client provided password
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (isValidPassword) {
                //prepaering user object to generate token
                const userObject = {
                    username: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role,
                };

                //generating token using jwt
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY,
                });

                // setting cookie. cookie(cookie-name, cookie-body, options)
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY, //how long will cookie stay
                    httpOnly: true, //only cookie will be usable in http protocol
                    singed: true, //cookie would be encrepted
                });

                //setting locals for user objects. So we can use these info in html/client side
                res.locals.loggedInUser = userObject;
                res.render("inbox");
            } else {
                throw createErroor("Login failed! Please try again");
            }
        } else {
            throw createErroor("Login failed! Please try again");
        }
    } catch (error) {
        res.render("index", {
            data: {
                username: req.body.username,
            },
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
}

module.exports = {
    getLogin,
    login,
};
