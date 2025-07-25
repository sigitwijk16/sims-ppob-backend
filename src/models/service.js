const db = require("../config/db");

async function getAllServices() {
  const res = await db.query(
    "SELECT service_code, service_name, service_icon, service_tariff FROM services",
    []
  );
  return res.rows;
}

module.exports = { getAllServices };
