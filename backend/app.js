const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const connectDB        = require('./db')
const authRoutes       = require('./routes/authRoutes')
const adminRoutes      = require('./routes/adminRoutes')
const volunteerRoutes  = require('./routes/volunteerRoutes')
const therapistRoutes  = require('./routes/therapistRoutes')
const assessmentRoutes = require('./routes/assessmentRoutes')
const bookingRoutes    = require('./routes/bookingRoutes')
const chatbotRoutes    = require('./routes/chatbotRoutes')
const questionRoutes   = require('./routes/questionRoutes')
const paymentRoutes    = require('./routes/paymentRoutes')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth',        authRoutes)
app.use('/api/admin',       adminRoutes)
app.use('/api/volunteers',  volunteerRoutes)
app.use('/api/therapists',  therapistRoutes)
app.use('/api/assessments', assessmentRoutes)
app.use('/api/bookings',    bookingRoutes)
app.use('/api/chatbot',     chatbotRoutes)
app.use('/api/questions',  questionRoutes)
app.use('/api/payments',   paymentRoutes)

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`)
  )
})