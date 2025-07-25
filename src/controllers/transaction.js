const userModel = require("../models/user");
const balanceModel = require("../models/balance");
const serviceModel = require("../models/service");
const transactionModel = require("../models/transaction");
const { success, error } = require("../utils/response");

function getUserIdFromEmail(email) {
  return userModel.findByEmail(email).then((user) => (user ? user.id : null));
}

exports.getBalance = async (req, res, next) => {
  try {
    const userId = await getUserIdFromEmail(req.user.email);
    if (!userId)
      return res
        .status(401)
        .json(error(108, "Token tidak tidak valid atau kadaluwarsa"));
    const bal = await balanceModel.getBalance(userId);
    return res.json(
      success("Get Balance Berhasil", {
        balance: bal ? Number(bal.balance) : 0
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.topUp = async (req, res, next) => {
  try {
    const userId = await getUserIdFromEmail(req.user.email);
    if (!userId)
      return res
        .status(401)
        .json(error(108, "Token tidak tidak valid atau kadaluwarsa"));
    const { top_up_amount } = req.body;

    // Validate top_up_amount
    if (!top_up_amount || top_up_amount <= 0) {
      return res.status(400).json(error(102, "Top Up Amount tidak valid"));
    }

    const bal = await balanceModel.getBalance(userId);
    const currentBalance = bal ? Number(bal.balance) : 0;
    const topUpAmount = Number(top_up_amount);

    // Check for potential overflow
    if (currentBalance + topUpAmount > Number.MAX_SAFE_INTEGER) {
      return res.status(400).json(error(102, "Jumlah top up terlalu besar"));
    }

    const newBalance = currentBalance + topUpAmount;
    await balanceModel.setBalance(userId, newBalance);
    const invoice_number = "INV" + Date.now();
    await transactionModel.createTransaction({
      user_id: userId,
      invoice_number,
      service_code: null,
      transaction_type: "TOPUP",
      description: "Top Up balance",
      total_amount: topUpAmount
    });
    return res.json(
      success("Top Up Balance berhasil", { balance: newBalance })
    );
  } catch (err) {
    next(err);
  }
};

exports.transaction = async (req, res, next) => {
  try {
    const userId = await getUserIdFromEmail(req.user.email);
    if (!userId)
      return res
        .status(401)
        .json(error(108, "Token tidak tidak valid atau kadaluwarsa"));
    const { service_code } = req.body;
    const service = await serviceModel
      .getAllServices()
      .then((services) =>
        services.find((s) => s.service_code === service_code)
      );
    if (!service) {
      return res
        .status(400)
        .json(error(102, "Service atau Layanan tidak ditemukan"));
    }
    const bal = await balanceModel.getBalance(userId);
    if (!bal || bal.balance < service.service_tariff) {
      return res.status(400).json(error(105, "Saldo tidak mencukupi"));
    }
    const newBalance = bal.balance - service.service_tariff;
    await balanceModel.setBalance(userId, newBalance);
    const invoice_number = "INV" + Date.now();
    const trx = await transactionModel.createTransaction({
      user_id: userId,
      invoice_number,
      service_code: service.service_code,
      transaction_type: "PAYMENT",
      description: service.service_name,
      total_amount: service.service_tariff
    });
    return res.json(
      success("Transaksi berhasil", {
        invoice_number: trx.invoice_number,
        service_code: trx.service_code,
        service_name: service.service_name,
        transaction_type: trx.transaction_type,
        total_amount: Number(trx.total_amount),
        created_on: trx.created_on
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.history = async (req, res, next) => {
  try {
    const userId = await getUserIdFromEmail(req.user.email);
    if (!userId)
      return res
        .status(401)
        .json(error(108, "Token tidak tidak valid atau kadaluwarsa"));
    const offset = parseInt(req.query.offset) || 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const records = await transactionModel.getHistory(userId, offset, limit);

    // Convert numeric fields to numbers
    const formattedRecords = records.map((record) => ({
      ...record,
      total_amount: Number(record.total_amount)
    }));

    return res.json(
      success("Get History Berhasil", {
        offset,
        limit,
        records: formattedRecords
      })
    );
  } catch (err) {
    next(err);
  }
};
