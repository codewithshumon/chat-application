//External imports
const express = require("express");

//Internal imports
const { getUsers, addUsers } = require("../controller/usersController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
    addUserValidator,
    addUserValidatorHandler,
} = require("../middlewares/users/userValidators");

const router = express.Router();

//user page router
router.get("/", decoHtmlRes("Users"), getUsers);

//create user, here using multer validate file and form fields data. and we can only parse these data only by multer. if we put validation after multer middleware then we can't parse multer data. so we need to put validation middleware after multer
router.post("/", avatarUpload, addUserValidator, addUserValidatorHandler, addUsers);

module.exports = router;
