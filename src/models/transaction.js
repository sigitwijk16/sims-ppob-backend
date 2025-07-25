const db = require("../config/db");

async function createTransaction({
  user_id,
  invoice_number,
  service_code,
  transaction_type,
  description,
  total_amount
}) {
  const res = await db.query(
    "INSERT INTO transactions (user_id, invoice_number, service_code, transaction_type, description, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      user_id,
      invoice_number,
      service_code,
      transaction_type,
      description,
      total_amount
    ]
  );
  return res.rows[0];
}

async function getHistory(user_id, offset = 0, limit = null) {
  let query =
    "SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id = $1 ORDER BY created_on DESC";
  let params = [user_id];
  if (limit !== null) {
    query += " OFFSET $2 LIMIT $3";
    params.push(offset, limit);
  }
  const res = await db.query(query, params);
  return res.rows;
}

module.exports = { createTransaction, getHistory };
