//External imports
const express = require("express");

//Internal imports
const { getLogin, login } = require("../controller/loginController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");

const router = express.Router();

//get loging page
router.get("/", decoHtmlRes("Login"), getLogin);

//process login for users
router.post("/", login);

module.exports = router;
