import { registerUser, loginUser, logoutUser } from "../controllers/authController.js"
import express from "express"
import rateLimit from "express-rate-limit"

export const authRouter = express.Router()

// Rate limiting for auth endpoints (5 attempts per 15 minutes)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many authentication attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
})

authRouter.post('/register', authLimiter, registerUser)
authRouter.post('/login', authLimiter, loginUser)
authRouter.get('/logout', logoutUser)