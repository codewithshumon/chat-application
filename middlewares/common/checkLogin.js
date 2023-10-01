//external imports
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

//checking if user already logged in
const checkLogin = (req, res, next) => {
    //cookie info stay in req.signedCookies
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookies) {
        try {
            // here we got token = cookie-name's value
            token = cookies[process.env.COOKIE_NAME];

            //here we got user info from the jwt
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //we've setup this user in jwt token from loginController
            //setting all user info in req.user so we can use it in next middleware
            req.user = decoded;

            //if we got req.locals.html true form decoHtmlRes passing user info to locals
            if (res.locals.html) {
                res.locals.loggedInUser = decoded;
            }
            next();
        } catch (error) {
            if (res.locals.html) {
                res.redirect("/");
            } else {
                res.status(500).json({
                    errors: {
                        common: {
                            msg: "Authentication failed!",
                        },
                    },
                });
            }
        }
    } else {
        if (res.locals.html) {
            res.redirect("/");
        } else {
            res.status(401).json({
                errors: {
                    common: {
                        msg: "Authentication failed!",
                    },
                },
            });
        }
    }
};

//redirect middlerware for if user already login then redirect from index to inbox
const redirectLoggedIn = (req, res, next) => {
    //cookie info stay in req.signedCookies
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    console.log("cookies redicrect", cookies);

    //if cookie found that means user loggedIn so redirect to inbox
    if (!cookies) {
        next();
    } else {
        res.redirect("/inbox");
    }
};

// guard to protect routes that need role based authorization
const requireRole = (role) => {
    return function (req, res, next) {
        //we get req.user.role form checkLogin middle "req.user = decoded"
        if (req.user.role && role.includes(req.user.role)) {
            next();
        } else {
            if (res.locals.html) {
                next(createError(401, "You are not authorized to access this page!"));
            } else {
                res.status(401).json({
                    errors: {
                        common: {
                            msg: "You are not authorized!",
                        },
                    },
                });
            }
        }
    };
};
module.exports = { checkLogin, redirectLoggedIn, requireRole };
