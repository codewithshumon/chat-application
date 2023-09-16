//External import
const bcrypt = require("bcrypt");

// get users page
function getUsers(req, res, next) {
    res.render("users");
}

// add users data
async function addUsers(req, res, next) {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword,
        });
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
    }

    try {
        const result = await newUser.save();
        res.status(200).json({
            message: "New user add successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: {
                common: "Unknown error occured",
            },
        });
    }
}

module.exports = {
    getUsers,
    addUsers,
};
