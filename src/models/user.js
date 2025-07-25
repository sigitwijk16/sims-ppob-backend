const db = require("../config/db");

async function findByEmail(email) {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
}

async function createUser({ email, first_name, last_name, password_hash }) {
  const res = await db.query(
    "INSERT INTO users (email, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, first_name, last_name, password_hash]
  );
  return res.rows[0];
}

async function updateProfile(email, { first_name, last_name }) {
  const res = await db.query(
    "UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING *",
    [first_name, last_name, email]
  );
  return res.rows[0];
}

async function updateProfileImage(email, profile_image) {
  const res = await db.query(
    "UPDATE users SET profile_image = $1 WHERE email = $2 RETURNING *",
    [profile_image, email]
  );
  return res.rows[0];
}

async function getProfile(email) {
  const res = await db.query(
    "SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0];
}

module.exports = {
  findByEmail,
  createUser,
  updateProfile,
  updateProfileImage,
  getProfile
};
