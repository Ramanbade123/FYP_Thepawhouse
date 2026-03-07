import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded files (profile images, pet images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Test route
app.get("/", (req, res) => {
  res.send("The Paw House API is running")
})

export default app