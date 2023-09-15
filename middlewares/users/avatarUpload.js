function avatarUpload(req, res, next) {
    const upload = uploader(
        "avatars",
        ["image/jpeg", "image/jpg", "image/png"],
        1000000,
        "Only jpeg, jpg and png files are allowed!",
    );
    next();
}

module.exports = avatarUpload;
