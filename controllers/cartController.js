import { getDBConnection } from "../db/db.js";

export async function addToCart(req, res) {
    const db = await getDBConnection()

    const userId = req.session.userId
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

    const userId = req.session.userId

    const numProduct = await db.get(`
        SELECT SUM(quantity) AS total_items FROM cart_items WHERE user_id = ?
    `, [userId])
    
    res.json({ totalItems: numProduct.total_items || 0 })
}

export async function getAll(req, res) {
    
    const userId = req.session.userId

    if (!userId) {
        return res.json({ err: 'not logged in' })
    }

    const db = await getDBConnection()

    const items = await db.all(`
        SELECT ci.id AS cartItemId, ci.quantity, 
            p.title, p.artist, p.price 
        FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = ?
    `, [userId])

    res.json({ items: items})
}

export async function deleteItem(req, res) {

    const db = await getDBConnection();

    if (!isNaN(req.body.cartItemId)) {
        return res.status(400).json({ error: 'Invalid item ID' })
    }

    const deleteItem = await db.get(`
        SELECT quantity FROM cart_items WHERE cartItemId = ? AND user_id = ?
    `, [req.body.cartItemId, req.session.userId])

    if (deleteItem.quantity === 0) {
        return res.status(400).json({ error: 'Invalid item ID' })
    }

    await db.run( `
        DELETE FROM cart_items WHERE cartItemId = ? AND user_id = ?
    `, [req.body.cartItemId, req.session.userId])


    res.sendStatus(204)
}

export async function deleteAll(req, res) {

    const db = await getDBConnection()

    await db.run(`
        DELETE FROM cart_items WHERE user_id = ?
    `, [req.session.userId])

    res.status(204).send()
}
