//External imports
const express = require("express");

//Internal imports
const { getInbox } = require("../controller/inboxController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get("/", decoHtmlRes("Inbox"), checkLogin, getInbox);

module.exports = router;
