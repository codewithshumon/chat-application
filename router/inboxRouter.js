// external imports
const express = require("express");

// internal imports
const {
    getInbox,
    searchUser,
    addConversation,
    getMessages,
    sendMessage,
    removeConAndMsg,
} = require("../controller/inboxController");
const decoHtmlRes = require("../middlewares/common/decoHtmlRes");
const { checkLogin } = require("../middlewares/common/checkLogin");
const attachmentUpload = require("../middlewares/inbox/attachmentUpload");

const router = express.Router();

// inbox page
router.get("/", decoHtmlRes("Inbox"), checkLogin, getInbox);

// search user for conversation
router.post("/search", checkLogin, searchUser);

// add conversation
router.post("/conversation", checkLogin, addConversation);

// get messages of a conversation
router.get("/messages/:conversation_id", checkLogin, getMessages);

// send message
router.post("/message", checkLogin, attachmentUpload, sendMessage);

// remove conversation and messages of the conversations ID
router.delete("/:id", checkLogin, removeConAndMsg);

module.exports = router;
