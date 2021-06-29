const resultsNav = document.getElementById('results-nav')
const favoritesNav = document.getElementById('favorites-nav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')

// NASA API
const count = 10
const API_KEY = 'DEMO_KEY'
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`

let resultsArr = []
let favorites = {}
const LOCAL_STORE_KEY = 'favorites'

// remove loader
function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (page === 'results') {
        resultsNav.classList.remove('hidden')
        favoritesNav.classList.add('hidden')
    } else {
        favoritesNav.classList.remove('hidden')
        resultsNav.classList.add('hidden')
    }
    loader.classList.add('hidden')
}

// get favorites from local storage if it exists
function getFavorites() {
    const tempFavorites = localStorage.getItem(LOCAL_STORE_KEY)
    if (tempFavorites) {
        favorites = JSON.parse(tempFavorites)
    }
}

// add result to favorites
function saveFavorite(url) {
    const index = resultsArr.findIndex((item) => item.url === url)
    if (!favorites[url]) {
        favorites[url] = resultsArr[index]
        // show saved confirmation for 2 seconds
        saveConfirmed.hidden = false
        setTimeout(() => {
            saveConfirmed.hidden = true
        }, 2000)
        // set favorites in local storage
        localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(favorites))
    }
}

// remove item from favorites
function removeFavorite(url) {
    if (favorites[url]) {
        delete favorites[url]
        localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(favorites))
        updateDOM('favorites')
    }
}

function createDOMNodes(page) {
    const arr = page === 'results' ? resultsArr : Object.values(favorites)
    arr.forEach((item) => {
        // card
        const card = document.createElement('div')
        card.className = 'card'
        // link
        const link = document.createElement('a')
        link.setAttribute('title', 'View Full Image')
        link.setAttribute('href', item.hdurl)
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrel')
        // image
        const image = document.createElement('img')
        image.className = 'card-img-top'
        image.setAttribute('src', item.url)
        image.setAttribute('title', item.title)
        image.setAttribute('alt', item.title)
        image.loading = 'lazy'
        // body
        const body = document.createElement('div')
        body.className = 'card-body'
        // title
        const title = document.createElement('h3')
        title.className = 'card-title'
        title.textContent = `${item.title}`
        // add to favorite
        const favoriteBtn = document.createElement('p')
        favoriteBtn.className = 'clickable'
        favoriteBtn.textContent =
            page === 'results' ? 'Add to Favorites' : 'Remove From Favorites'
        favoriteBtn.setAttribute(
            'onclick',
            page === 'results'
                ? `saveFavorite('${item.url}')`
                : `removeFavorite('${item.url}')`
        )
        // text
        const text = document.createElement('p')
        text.className = 'card-text'
        text.textContent = item.explanation
        // footer
        const footer = document.createElement('small')
        footer.className = 'text-muted'
        const date = document.createElement('strong')
        date.textContent = item.date
        const copyright = document.createElement('span')
        copyright.textContent = ` ${item.copyright || ''}`
        // structure result item
        footer.append(date, copyright)
        body.append(title, favoriteBtn, text, footer)
        link.appendChild(image)
        card.append(link, body)
        // append to DOM
        imagesContainer.appendChild(card)
    })
}

// update DOM
function updateDOM(page) {
    // reset image containers
    imagesContainer.textContent = ''
    // get favorites from local storage
    getFavorites()
    createDOMNodes(page)
    showContent(page)
}

// get 10 images from NASA API
async function getNASAPictures() {
    // show loader
    loader.classList.remove('hidden')
    try {
        const response = await fetch(API_URL)
        resultsArr = await response.json()
        updateDOM('results')
    } catch (error) {
        console.error(error)
    }
}

// event listeners

// on load
getNASAPictures()
getFavorites()
