const express = require("express");
const router = express.Router();

router.use("/", require("./auth"));
router.use("/", require("./profile"));
router.use("/", require("./info"));
router.use("/", require("./transaction"));

module.exports = router;
