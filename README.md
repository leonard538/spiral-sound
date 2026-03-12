# Spiral Sound

An online vinyl record shop prototype/simulation built with Node.js and Express.

## Description

Spiral Sound is a backend API for a vinyl record e-commerce application. It provides endpoints to browse, filter, and search through a catalog of vinyl records with details like artist, title, price, genre, and stock availability.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** SQLite3
- **Other:** CORS enabled for cross-origin requests

## Project Structure

```
spiral_sound/
├── server.js           # Main entry point
├── data.js             # Sample vinyl data
├── createTable.js      # Database table creation
├── seedTable.js        # Database seeding script
├── controllers/
│   └── productsController.js   # Product logic
├── routes/
│   └── products.js     # API routes
├── db/
│   └── db.js           # Database connection
└── public/             # Static files
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?genre={genre}` | Filter products by genre |
| GET | `/api/products?search={term}` | Search products by title, artist, or genre |
| GET | `/api/products/genres` | Get all distinct genres |

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The server will run at `http://localhost:8000`

## Author

Leonard

## License

ISC

---

### Learn to Code

This project was built while learning with [Scrimba](https://scrimba.com/?via=u42c5f8e) — an interactive platform for learning to code through hands-on projects.
