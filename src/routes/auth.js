const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const router = express.Router();

const authController = require("../controllers/auth");

router.post(
  "/registration",
  [
    body("email").isEmail().withMessage("Paramter email tidak sesuai format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Paramter password minimal 8 karakter"),
    body("first_name").notEmpty().withMessage("First name wajib diisi"),
    body("last_name").notEmpty().withMessage("Last name wajib diisi"),
    validate
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Paramter email tidak sesuai format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Paramter password minimal 8 karakter"),
    validate
  ],
  authController.login
);

module.exports = router;
