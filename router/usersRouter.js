//External imports
const express = require("express");

//Internal imports
const { getUsers } = require("../controller/usersController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");

const router = express.Router();

router.get("/", decoHtmlRes("Users"), getUsers);

module.exports = router;
