const express = require("express");
const trimRequest = require('trim-request');
const authMiddleware = require("../middleware/authMiddleware");
const {
  createGroup,
  create_open_conversation,
  getConversations,
  markMessagesAsSeen,
} = require("../controllers/conversation.controller.js");
const router = express.Router();

router
  .route("/")
  .post(trimRequest.all, authMiddleware, create_open_conversation);
router.route("/").get(trimRequest.all, authMiddleware, getConversations);
router.route("/group").post(trimRequest.all, authMiddleware, createGroup);


router.route('/:convo_id/seen').put(trimRequest.all , authMiddleware , markMessagesAsSeen)



module.exports = router;
