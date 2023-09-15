//External imports
const express = require("express");

//Internal imports
const { getInbox } = require("../controller/inboxController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");

const router = express.Router();

router.get("/", decoHtmlRes("Inbox"), getInbox);

module.exports = router;
