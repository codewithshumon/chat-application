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
                    userid: user._id,
                    username: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    avatar: user.avatar || null,
                    role: user.role || "user",
                };

                //generating token using jwt
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY,
                });

                // setting cookie. cookie(cookie-name, cookie-body, options)
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY, //how long will cookie stay
                    httpOnly: true, //only cookie will be usable in http protocol
                    signed: true, //cookie would be encrepted
                });

                //setting locals for user objects. So we can use these info in html/client side
                //setting blank loggedInUser in middlewares/common/decoHtmlRes.js
                res.locals.loggedInUser = userObject;
                res.redirect("inbox");
            } else {
                throw createErroor("Login failed! Please try again");
            }
        } else {
            throw createErroor("Invalid user! Please try again");
        }
    } catch (error) {
        res.render("index", {
            //this is need to put on ejs form like (value="<%= data.username %>")
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

//do logout
async function logout(req, res) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send("Logged out");
}

module.exports = {
    getLogin,
    login,
    logout,
};
