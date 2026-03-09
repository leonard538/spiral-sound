import { vynil } from "./data.js"
import path from "node:path"
import { open } from "sqlite"
import sqlite3 from "sqlite3"

async function seedTable() {
    
    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    try {
        await db.exec('BEGIN TRANSACTION')

        for (const { title, artist, price, image, year, genre, stock } of vynil) {
            await db.run(`
                INSERT INTO (title, artist, price, image, year, genre)
                VALUES (?, ?, ?, ?, ?, ?)    
            `, [title, artist, price, image, year, genre, stock])
        }

        await db.exec('COMMIT')
        console.log('All records inserted successfully.')
    } catch(error) {
        await db.exec('ROLLBACK')
        console.error('Error inserting data:', error.message)
    } finally {
        await db.close()
        console.log('Database connextion closed.')
    }
}

seedTable()