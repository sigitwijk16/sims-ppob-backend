const { Pool } = require("pg")
require("dotenv").config()

console.log("Database config:", {
  hasConnectionString: !!process.env.DATABASE_URL,
  hasIndividualParams: !!(process.env.DB_HOST && process.env.DB_USER),
})

const connectionString = process.env.DATABASE_URL

let poolConfig

if (connectionString) {
  poolConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  }
  console.log("Using connection string for database")
} else {
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  }
  console.log("Using individual parameters for database")
}

const pool = new Pool(poolConfig)

pool.on("connect", () => {
  console.log("✅ Connected to database")
})

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err.message)
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
}
