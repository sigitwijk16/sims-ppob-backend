const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const app = express()
const routes = require("./routes")

dotenv.config()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

  if (req.method === "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.get("/", (req, res) => {
  res.json({
    status: 0,
    message: "SIMS PPOB API is running",
    data: {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    },
  })
})

app.use("/", routes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    status: err.customStatus || 999,
    message: err.message || "Internal Server Error",
    data: null,
  })
})

module.exports = app
