import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const require   = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
const authRoutes      = require('./authRoutes')
const userRoutes      = require('./userRoutes')
const petRoutes       = require('./petRoutes')
const lostFoundRoutes = require('./lostfoundRoutes')
const reportRoutes    = require('./reportRoutes')
const diseaseRoutes   = require('./diseaseRoutes')
const donationRoutes  = require('./donationRoutes')
const reviewRoutes    = require('./reviewRoutes')
const messageRoutes   = require('./messageRoutes')

app.use('/api/auth',               authRoutes)
app.use('/api/users',              userRoutes)
app.use('/api/pets',               petRoutes)
app.use('/api/pets/:petId/reviews', reviewRoutes)   // nested: /api/pets/:petId/reviews
app.use('/api/lostfound',          lostFoundRoutes)
app.use('/api/reports',            reportRoutes)
app.use('/api/diseases',           diseaseRoutes)
app.use('/api/donations',          donationRoutes)
app.use('/api/messages',           messageRoutes)
app.use('/api/reviews',            reviewRoutes)    // also allow flat: /api/reviews/admin/all

// Test route
app.get("/", (req, res) => {
  res.send("The Paw House API is running")
})

export default app