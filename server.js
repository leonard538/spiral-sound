import express from "express"
import { productRouter } from "./routes/products.js"
import { authRouter } from "./routes/auth.js"
import cors from "cors"

const app = express()
const PORT = 8000

app.use(cors())

app.use(express.json())
// serve all files in public folder
app.use(express.static('public'))

app.use('/api/products', productRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (error) => {
    console.error('Failed to start the server:', error)
})