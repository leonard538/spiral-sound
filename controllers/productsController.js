import { getDBConnection  } from "../db/db.js"

export async function getGenres(req, res) {

    const db = await getDBConnection()
    
    try {
        const query = 'SELECT DISTINCT genre FROM products'
        const distinctGenre = await db.all(query)

        const send = distinctGenre.genre( row => row.genre)
        res.json(send)
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch genres:', details: error.message})
    }
}

export async function getProducts(req, res) {
    try {

        const db = await getDBConnection()
        let query = 'SELECT * FROM products'
        const allGenre = await db.all(query)
        res.json(allGenre)

    } catch (err) {
        res.status(500).json({error: 'Failed to fetch products', details: err.message})
    }

}