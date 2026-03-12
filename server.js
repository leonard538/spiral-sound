import express from "express"
import { productRouter } from "./routes/products.js"
import cors from "cors"

const app = express()
const PORT = 8000

app.use(cors())
// serve all files in public folder
app.use(express.static('public'))

app.use('/api/products', productRouter)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (error) => {
    console.error('Failed to start the server:', error)
})