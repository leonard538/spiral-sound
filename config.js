import dotenv from 'dotenv'

dotenv.config()

const requiredEnvVars = ['SPIRAL_SESSION_SECRET']

function validateEnv() {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
}

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '8000', 10),
    sessionSecret: process.env.SPIRAL_SESSION_SECRET,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production',
    databaseUrl: process.env.DATABASE_URL || 'database.db',
    corsOrigins: process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || ['http://localhost:3000'],
    
    validateEnv
}
