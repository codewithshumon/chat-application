const uploader = require("../../utilities/singleUploader");

//making the upload middleware function
function avatarUpload(req, res, next) {
    const upload = uploader(
        "avatars",
        ["image/jpeg", "image/jpg", "image/png"],
        1000000,
        "Only jpeg, jpg and png files are allowed!",
    );
    //upload.any() is multer middleware function, if it get and error it ignore all the fn and direct to error handler. It is to use upload file include fields. We need to call function if we get any error in multer then we can still go through and validate other fileds
    upload.any()(req, res, (err) => {
        if (err) {
            //here we making a error object the show the specific avatar fields error
            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message,
                    },
                },
            });
        } else {
            //if no error then pass the other fields middleware
            next();
        }
    });
}

module.exports = avatarUpload;
