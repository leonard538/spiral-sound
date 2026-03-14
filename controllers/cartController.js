import { getDBConnection } from "../db/db";

export async function addToCart(req, res) {
    const db = await getDBConnection()

    const userId = req.body.userId
    const productId = parseInt(req.body.productId, 10)

    if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' })
    }

    const isProductExist = await db.get('SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?', [productId, userId])

    if (isProductExist) {
        await db.run(`
            UPDATE cart_items
            SET quantity = quantity + 1
            WHERE user_id = ? AND product_id = ?    
        `, [userId, productId])
    } else {
        await db.run(`
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (?, ?, 1)    
        `, [userId, productId])
    }

    res.json({ message: 'Added to cart' })
}

export async function getCartCount(req, res) {
    const db = await getDBConnection()

    const userId = req.body.userId

    const numProduct = await db.get(`
        SELECT SUM(quantity) AS total_items FROM cart_items WHERE user_id = ?
    `, [userId])
    
    res.json({ totalItems: numProduct.total_items || 0 })
}