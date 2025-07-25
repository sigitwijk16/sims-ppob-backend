const db = require("../config/db");

async function getAllBanners() {
  const res = await db.query(
    "SELECT banner_name, banner_image, description FROM banners",
    []
  );
  return res.rows;
}

module.exports = { getAllBanners };
