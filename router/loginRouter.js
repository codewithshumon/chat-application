//External imports
const express = require("express");

//Internal imports
const { getLogin, login, logout } = require("../controller/loginController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");
const { loginValidator, loginValidatorHandler } = require("../middlewares/login/loginValidators");

const router = express.Router();

//set page title by variable
const page_title = "Login";

//get loging page
router.get("/", decoHtmlRes(page_title), getLogin);

//process login for users
router.post("/", decoHtmlRes(page_title), loginValidator, loginValidatorHandler, login);

//process logout for users
router.delete("/", logout);
module.exports = router;
