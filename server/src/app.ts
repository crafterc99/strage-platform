import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { clerkMiddleware } from '@clerk/express'
import { ordersRouter } from './routes/orders.js'
import { filesRouter } from './routes/files.js'
import { webhooksRouter } from './routes/webhooks.js'

const app = express()
const PORT = process.env.PORT || 3001

// Webhooks need raw body (must be before express.json)
app.use('/api/webhooks', express.raw({ type: 'application/json' }))

// Global middleware
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(clerkMiddleware())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/orders', ordersRouter)
app.use('/api/files', filesRouter)
app.use('/api/webhooks', webhooksRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
