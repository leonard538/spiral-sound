import path from "node:path"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import { getDBConnection } from "../db/db.js"

async function dropTable() {
    const db = await getDBConnection()

    await db.exec(`
        DROP TABLE IF EXIST users;
    `)

    await db.close()
    console.log('Database dropped')
}

dropTable()