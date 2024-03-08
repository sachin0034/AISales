const express = require("express");
const router = express.Router();
const { AdminLogin, GetAllVoices, SingleCall } = require("../Controller/Admin");
const requireAuth = require("../middleware/Admin");

router.route("/admin/login").post(AdminLogin);
router.route("/admin/get-all-voices").get(requireAuth, GetAllVoices);
router.route("/admin/single-call").post(requireAuth, SingleCall);

module.exports = router;
