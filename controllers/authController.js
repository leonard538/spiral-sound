import validator from 'validator'
import { getDBConnection } from '../db/db.js'
import bcrypt from 'bcryptjs'

// Minimum password requirements
const PASSWORD_MIN_LENGTH = 8

function isValidPassword(password) {
    if (password.length < PASSWORD_MIN_LENGTH) {
        return { valid: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` }
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' }
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' }
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' }
    }
    return { valid: true }
}

export async function registerUser(req, res) {

    let { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' })
    }

    name = name.trim()
    email = email.trim()
    username = username.trim()

    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
        return res.status(400).json({error: 'Username must be 1–20 characters, using letters, numbers, _ or -.'})
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({error: 'Invalid email'})
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message })
    }

    try {
        const db = await getDBConnection()
        const params = [username, email]
        const rows = await db.all('SELECT id FROM users WHERE username=? OR email=?', params)

        if (rows.length > 0) {
            return res.status(400).json({error: 'Email or username already in use.'})
        }

        const hashedPass = await bcrypt.hash(password, 12)
        const result = await db.run(`
            INSERT INTO users (name, email, username, password)
            VALUES(?, ?, ?, ?)  
        `, [name, email, username, hashedPass])
        
        req.session.userId = result.lastID

        return res.status(201).json({ message: 'User registered successfully'})

    } catch(err) {
        console.error('Registration error:', err.message)
        res.status(500).json({ error: 'Registration failed. Please try again.' })
    }
}

export async function loginUser(req, res) {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        const db = await getDBConnection()

        const user = await db.get('SELECT * FROM users WHERE username=?', [username])
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        req.session.userId = user.id
        res.json({ message: 'Logged in successfully' })

    } catch(err) {
        console.error('Login error:', err.message)
        res.status(500).json({ error: 'Login failed. Please try again.' })
    }
}

export async function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err.message)
            return res.status(500).json({ error: 'Logout failed' })
        }
        res.json({ message: 'Logged out successfully' })
    })
}