const createError = require("http-errors");

//404 not found error handler
function notFoundError(req, res, next) {
    next(createError(404, "Your requested page not found!"));
}

function errorhandler(err, req, res, next) {
    res.locals.error = process.env.NODE_ENV === "development" ? err : { Message: err.message };

    res.status(res.status | 500);

    if (res.locals.html) {
        res.render("error", {
            title: "Error Page",
        });
    } else {
        res.json(res.locals.error);
    }
}
module.exports = {
    notFoundError,
    errorhandler,
};
