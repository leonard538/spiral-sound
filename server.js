import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import { cartRouter } from './routes/cart.js' 
import session from 'express-session'
import { config } from './config.js'

// Validate environment configuration
try {
    config.validateEnv()
} catch (err) {
    console.error(err.message)
    process.exit(1)
}

const app = express() 
const { port, sessionSecret, isProduction, corsOrigins } = config

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parser with size limit
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ limit: '10kb', extended: false }))

// Session middleware
app.use(session({
    secret: sessionSecret,
    resave: false, 
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'sessionId'
}))

// Static files
app.use(express.static('public'))

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/products', productsRouter)
app.use('/api/auth/me', meRouter)
app.use('/api/auth', authRouter)
app.use('/api/cart', cartRouter)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' })
})

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const isDevelopment = !isProduction
    
    res.status(statusCode).json({
        error: isDevelopment ? err.message : 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    })
})

// Start server
const server = app.listen(port, '0.0.0.0', () => { 
    if (!isProduction) {
        console.log(`Server running at http://localhost:${port}`)
    }
}).on('error', (err) => {
    console.error('Failed to start server:', err.message)
    process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully')
    server.close(() => {
        console.log('Server closed')
        process.exit(0)
    })
})

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully')
    server.close(() => {
        console.log('Server closed')
        process.exit(0)
    })
}) 