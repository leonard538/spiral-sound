import { getDBConnection  } from "../db/db.js"

export async function getGenres(req, res) {
   
    try {
        const db = await getDBConnection()

        const query = 'SELECT DISTINCT genre FROM products'
        const distinctGenre = await db.all(query)

        const send = distinctGenre.map( row => row.genre)
        res.json(send)
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch genres:', details: error.message})
    }
}

export async function getProducts(req, res) {
    try {
        const db = await getDBConnection()

        let query = 'SELECT * FROM products'
        let params = []

        const { genre, search } = req.query

        if (genre) {
            query += ' WHERE genre = ?'
            params.push(genre)
        } else if (search) {
            query += ' WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?'
            const searchPattern = `%${search}%`
            params.push(searchPattern, searchPattern, searchPattern)
        }
        
        const products = await db.all(query, params)

        res.json(products)

} catch (err) {
    res.status(500).json({error: 'Failed to fetch products', details: err.message})
}
}