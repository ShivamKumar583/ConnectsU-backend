const express = require("express");
const trimRequest = require('trim-request');
const authMiddleware = require("../middleware/authMiddleware");
const { sendMessage, getMessages, addMessageReaction, removeMessageReaction } = require("../controllers/message.controller");
const { route } = require("./auth.route");
const router = express.Router(); 

router.route("/").post(trimRequest.all, authMiddleware, sendMessage);
router.route("/:convo_id").get(trimRequest.all, authMiddleware, getMessages);

// reactions feature
router.route('/:message_id/reaction').post(trimRequest.all,authMiddleware , addMessageReaction);
router.route('/:message_id/reaction').delete(trimRequest.all , authMiddleware, removeMessageReaction);

module.exports = router; 
