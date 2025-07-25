const userModel = require("../models/user");
const { success, error } = require("../utils/response");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userModel.getProfile(req.user.email);
    if (!user) {
      return res.status(404).json(error(104, "User tidak ditemukan"));
    }
    user.profile_image = user.profile_image || null;
    return res.json(success("Sukses", user));
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    const user = await userModel.updateProfile(req.user.email, {
      first_name,
      last_name
    });
    if (!user) {
      return res.status(404).json(error(104, "User tidak ditemukan"));
    }
    user.profile_image = user.profile_image || null;
    return res.json(success("Update Pofile berhasil", user));
  } catch (err) {
    next(err);
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(error(102, "Format Image tidak sesuai"));
    }
    const imageUrl =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
    const user = await userModel.updateProfileImage(req.user.email, imageUrl);
    if (!user) {
      return res.status(404).json(error(104, "User tidak ditemukan"));
    }
    user.profile_image = user.profile_image || null;
    return res.json(success("Update Profile Image berhasil", user));
  } catch (err) {
    if (err.message === "Format Image tidak sesuai") {
      return res.status(400).json(error(102, err.message));
    }
    next(err);
  }
};
