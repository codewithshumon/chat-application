//external imports
const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
    //cookie info stay in req.signedCookies
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookies) {
        try {
            // here we got token = cookie-name's value
            token = cookies[process.env.COOKIE_NAME];

            //here we got user info from the jwt
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

module.exports = { checkLogin, redirectLoggedIn };
