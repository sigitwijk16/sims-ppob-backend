const express = require("express");
const { body, query } = require("express-validator");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const transactionController = require("../controllers/transaction");
const router = express.Router();

router.get("/balance", auth, transactionController.getBalance);

router.post(
  "/topup",
  auth,
  [
    body("top_up_amount")
      .isInt({ min: 0 })
      .withMessage(
        "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
      ),
    validate
  ],
  transactionController.topUp
);

router.post(
  "/transaction",
  auth,
  [
    body("service_code").notEmpty().withMessage("Service code wajib diisi"),
    validate
  ],
  transactionController.transaction
);

router.get(
  "/transaction/history",
  auth,
  [
    query("offset")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Offset harus angka >= 0"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit harus angka > 0"),
    validate
  ],
  transactionController.history
);

module.exports = router;
