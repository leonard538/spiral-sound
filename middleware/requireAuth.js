export function requireAuth(req, res, next) {

    if (!req.session.userId) {
        console.log('Access Blocked')
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    next()
}