// ===== Menu Toggle =====
const toggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.header-menu')

// ===== Product Fetching =====
async function  getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters)
    const res = await fetch(`/api/products?${queryParams}`)
    return await res.json()
}

// ===== Product Rendering =====
function renderProducts (products) {
    const albumsContainer = document.getElementById('products-container')

    const cards = products.map( album => {
        return `
            <div class="product-card">
                <img src="./images/${album.image}" alt="${album.title}">
                <h2>${album.title}</h2>
                <h3>${album.artist}</h3>
                <p>$${album.price}</p>
                <button class="add-btn">Add to Cart</button>
                <p class="genre-label">${album.genre}</p>
            </div>
        `
    }).join('')

    albumsContainer.innerHTML = cards
}

// ===== Initial Load =====

/**
 * Fetches and displays all products on initial page load.
 */

async function init() {
    const products = await getProducts()
    renderProducts(products)
    populateGenreSelect()
}

init()

// ===== Genre Dropdown =====

/**
 * Populates the genre dropdown with available genres from the API.
 */
async function populateGenreSelect() {
    const res = await fetch('/api/products/genre')
    const genres = await res.json()
    const select = document.getElementById('genre-select')

    genres.forEach( genre => {
        const option = document.createElement('option')
        option.value = genre
        option.textContent = genre
        select.appendChild(option)
    })
}


// ===== Filter Handling =====

/**
 * Fetches and renders products based on the current search input.
 */
async function applySearchFilter() {
    const search = document.getElementById('search-input').value.trim()
    const filters = {}
    if (search) filters.search = search

    const products = await getProducts(filters)
    renderProducts(products)
}

// ===== Event Listeners =====
document.getElementById('search-input').addEventListener('click', (e) => {
    e.preventDefault()
    applySearchFilter()
})

// prevent 'Enter' from submitting
document.getElementById('search-input').addEventListener('submit', (e) => {
    e.preventDefault()
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    applySearchFilter() // funtion to run the search
})

document.getElementById('genre-select').addEventListener('submit', async (e) => {
    const genre = e.target.value
    const products = await getProducts(genre ? {genre} : {})
    renderProducts(products)
})