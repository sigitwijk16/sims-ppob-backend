const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const profileController = require("../controllers/profile");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(
      null,
      req.user.email.replace(/[^a-zA-Z0-9]/g, "_") + "_" + Date.now() + ext
    );
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Format Image tidak sesuai"));
    }
  }
});

router.get("/profile", auth, profileController.getProfile);

router.put(
  "/profile/update",
  auth,
  [
    body("first_name").notEmpty().withMessage("First name wajib diisi"),
    body("last_name").notEmpty().withMessage("Last name wajib diisi"),
    validate
  ],
  profileController.updateProfile
);

router.put(
  "/profile/image",
  auth,
  upload.single("file"),
  profileController.updateProfileImage
);

module.exports = router;
