const bannerModel = require("../models/banner");
const serviceModel = require("../models/service");
const { success } = require("../utils/response");

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await bannerModel.getAllBanners();
    return res.json(success("Sukses", banners));
  } catch (err) {
    next(err);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const services = await serviceModel.getAllServices();
    return res.json(success("Sukses", services));
  } catch (err) {
    next(err);
  }
};
