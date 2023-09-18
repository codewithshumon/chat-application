function decoHtmlRes(page_title) {
    return (req, res, next) => {
        res.locals.html = true;
        res.locals.title = `${page_title} - ${process.env.APP_NAME}`;
        //setting locals verialbe blank to templete can give error
        res.locals.loggedInUser = {};
        res.locals.errors = {};
        res.locals.data = {};
        next();
    };
}

module.exports = decoHtmlRes;
