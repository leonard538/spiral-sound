import { getDBConnection } from "../db/db";

export async function getCurrentUser(req, res) {
    try {
        const db = await getDBConnection()
        const userId = req.session.userId

        if (!userId) {
            return res.json({ isLoggedIn: false })
        }

        const { name } = await db.get('SELECT * FROM users WHERE id=?', [userId])
        return res.json({ isLoggedIn: true, name: name})
    } catch (err) {
        console.error('getCurrentUser error: ', err)
        res.status(500).json({ error: 'Internal server error'})
    }
}