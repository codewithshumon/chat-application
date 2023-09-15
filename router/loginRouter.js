//External imports
const express = require("express");

//Internal imports
const { getLogin } = require("../controller/loginController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");

const router = express.Router();

router.get("/", decoHtmlRes("Login"), getLogin);

module.exports = router;
