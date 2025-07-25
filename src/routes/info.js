const express = require("express");
const auth = require("../middlewares/auth");
const infoController = require("../controllers/info");
const router = express.Router();

router.get("/banner", infoController.getBanners);
router.get("/services", auth, infoController.getServices);

module.exports = router;
