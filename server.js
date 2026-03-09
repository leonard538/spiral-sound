import express from "express"
import { productRouter } from "./routes/products.js"

const app = express()
const PORT = 8000

// serve all files in public folder
app.use(express.static('public'))

app.use('/api/products', productRouter)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (error) => {
    console.error('Failed to start the server:', error)
})