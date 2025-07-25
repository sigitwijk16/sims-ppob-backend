const db = require("../config/db");

async function getBalance(user_id) {
  const res = await db.query(
    "SELECT balance FROM balances WHERE user_id = $1",
    [user_id]
  );
  return res.rows[0];
}

async function setBalance(user_id, balance) {
  const res = await db.query(
    "UPDATE balances SET balance = $1 WHERE user_id = $2 RETURNING *",
    [balance, user_id]
  );
  return res.rows[0];
}

async function createBalance(user_id, balance = 0) {
  const res = await db.query(
    "INSERT INTO balances (user_id, balance) VALUES ($1, $2) RETURNING *",
    [user_id, balance]
  );
  return res.rows[0];
}

module.exports = { getBalance, setBalance, createBalance };
