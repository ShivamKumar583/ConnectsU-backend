const express = require("express");
const trimRequest = require('trim-request');
const { searchUsersService } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(trimRequest.all, authMiddleware, searchUsersService);
module.exports = router;