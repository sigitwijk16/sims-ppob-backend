const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const balanceModel = require("../models/balance");
const { generateToken } = require("../utils/jwt");
const { success, error } = require("../utils/response");

exports.register = async (req, res, next) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(400).json(error(101, "Email sudah terdaftar"));
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({
      email,
      first_name,
      last_name,
      password_hash
    });
    await balanceModel.createBalance(user.id, 0);
    return res.json(success("Registrasi berhasil silahkan login"));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json(error(103, "Username atau password salah"));
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json(error(103, "Username atau password salah"));
    }
    const token = generateToken(user.email);
    return res.json(success("Login Sukses", { token }));
  } catch (err) {
    next(err);
  }
};
