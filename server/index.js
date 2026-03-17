import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import userRoutes from './routes/user.js'
import videoRoutes from './routes/video.js'
import commentsRoutes from './routes/comments.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads folder exists (needed on cloud servers)
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}))
app.use(express.json({ limit: "30mb" }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use('/uploads', express.static(uploadsDir))

app.get('/', (req, res) => {
    res.send("Server is running")
})

app.use('/user', userRoutes)
app.use('/video', videoRoutes)
app.use('/comment', commentsRoutes)

const PORT = process.env.PORT || 5500
const DB_URL = process.env.CONNECTION_URL

if (!DB_URL) {
    console.error("ERROR: CONNECTION_URL environment variable is not set.")
    process.exit(1)
}

mongoose.connect(DB_URL).then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}).catch((error) => {
    console.error("MongoDB connection failed:", error.message)
    process.exit(1)
})