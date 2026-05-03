import { getDBConnection } from "../db/db.js";

export async function addToCart(req, res) {
    try {
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
    } catch (err) {
        console.error('Add to cart error:', err.message)
        res.status(500).json({ error: 'Failed to add to cart' })
    }
}

export async function getCartCount(req, res) {
    try {
        const db = await getDBConnection()

        const userId = req.session.userId

        const numProduct = await db.get(`
            SELECT SUM(quantity) AS total_items FROM cart_items WHERE user_id = ?
        `, [userId])
        
        res.json({ totalItems: numProduct.total_items || 0 })
    } catch (err) {
        console.error('Get cart count error:', err.message)
        res.status(500).json({ error: 'Failed to get cart count' })
    }
}

export async function getAll(req, res) {
    try {
        const userId = req.session.userId

        if (!userId) {
            return res.status(401).json({ error: 'Not logged in' })
        }

        const db = await getDBConnection()

        const items = await db.all(`
            SELECT ci.id AS cartItemId, ci.quantity, 
                p.title, p.artist, p.price 
            FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = ?
        `, [userId])

        res.json({ items: items })
    } catch (err) {
        console.error('Get cart error:', err.message)
        res.status(500).json({ error: 'Failed to retrieve cart' })
    }
}

export async function deleteItem(req, res) {
    try {
        const db = await getDBConnection()
        const itemId = parseInt(req.params.itemId)

        if (isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid item ID' })
        }

        const item = await db.get(`
            SELECT id FROM cart_items WHERE id = ? AND user_id = ?
        `, [itemId, req.session.userId])

        if (!item) {
            return res.status(404).json({ error: 'Item not found' })
        }

        await db.run( `
            DELETE FROM cart_items WHERE id = ? AND user_id = ?
        `, [itemId, req.session.userId])

        res.sendStatus(204)
    } catch (err) {
        console.error('Delete cart item error:', err.message)
        res.status(500).json({ error: 'Failed to delete item' })
    }
}

export async function deleteAll(req, res) {
    try {
        const db = await getDBConnection()

        await db.run(`
            DELETE FROM cart_items WHERE user_id = ?
        `, [req.session.userId])

        res.status(204).send()
    } catch (err) {
        console.error('Delete all cart items error:', err.message)
        res.status(500).json({ error: 'Failed to clear cart' })
    }
}
