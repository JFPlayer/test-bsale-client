//templates
import Product from '../templates/Product'
import Pagination from '../templates/Pagination'

// styles
import '../styles/Home.scss'

//service
import * as productService from '../services/product'
import * as cartService from '../services/cart'


//header functions
import './header.js'


//main elements
const catalogList = document.querySelector('#catalog-list')
const paginationContainer = document.querySelector('#pagination-container')

/**
 * Initial state
 */
let state = {
  products: [],
  page: 1,
  search: '',
  searchCategory: '',
  limit: 10,
  cart: [],
  totalProducts: 0,
  timeoutId: null,
}

/**
 * Gets a property value of the state by key
 * @param {String} key A property of the state
 * @returns {*} A property value of the state
 */
function getState(key) {
  return state[key]
}

/**
 * Updates the state by an action type and a value
 * @param {String} action Type of action
 * @param {*} payload 
 */
function setState(action, payload) {
  switch (action) {
    case 'set-products':
      state = {
        ...state,
        products: payload.products,
        totalProducts: payload.totalProducts,
      }
      renderCatalog()
      break
    case 'set-timeoutId':
      state = {
        ...state,
        timeoutId: payload
      }
      break
    case 'set-page':
      state = {
        ...state,
        page: payload
      }
      break
    case 'set-search':
      state = {
        ...state,
        search: payload
      }
      searchProducts()
      break
    case 'set-searchCategory':
      state = {
        ...state,
        searchCategory: payload
      }
      break
    case 'update-cart':
      let isRepeat = false
      const productFound = state.products.find(({id}) => id == payload)
      
      let updatedCart = state.cart.map(product => {
        if(product.id === productFound.id) {
          isRepeat = true
          return {
            ...product,
            quantity: product.quantity + 1
          }
        }
        return product
      })

      if(!isRepeat) updatedCart.push({
        ...productFound,
        quantity: 1
      })
      
      state = {
        ...state,
        cart: updatedCart
      }
      cartService.updateCart(state.cart)
      break
    case 'set-cart':
      state = {
        ...state,
        cart: payload
      }
      break
    default:
      null
  }
}

/**
 * Updates the page number
 * @param {EventListenerOrEventListenerObject} event 
 */
function changePage(event) {
  const page = event.target.dataset.page || event.target.parentNode.dataset.page
  let isNewPage = false
  const currentPage = getState('page')
  const totalPages = Math.ceil(getState('totalProducts') / getState('limit'))
  
  if(page === 'back' && currentPage > 1) {
    setState('set-page', currentPage - 1)
    isNewPage = true
  }
  
  if(page === 'forward' && currentPage < totalPages) {
    setState('set-page', currentPage + 1)
    isNewPage = true
  }
  
  if(page > 0 && page <= totalPages && page != currentPage) {
    setState('set-page', page)
    isNewPage = true
  }

  if(isNewPage) {
    const keyword = getState('search')
    const categoryId = getState('searchCategory')
    productService.getProducts({keyword, page, categoryId})
      .then(({ products, total }) => {
        setState('set-products', { products, totalProducts: total })
        setState('set-page', page)
        window.scrollTo(0, 0)
      })
      .catch(() => {
        setState('set-products', { products: [], totalProducts: 0 })
        setState('set-page', 1)
        window.scrollTo(0, 0)
      })
  }
}

/**
 * Adds a product to cart by productId
 * @param {EventListenerOrEventListenerObject} event 
 */
function addCart(event) {
  const action = event.target.dataset.action || event.target.parentNode.dataset.action
  if(action === 'add') {
    const productId = event.target.dataset.product || event.target.parentNode.dataset.product

    setState('update-cart', productId)
  }
}

/**
 * Renders the main page, catalog and pagination
 */
function renderCatalog() {
  const products = getState('products')
  const totalPages = Math.ceil(getState('totalProducts') / getState('limit'))

  renderProducts(products)
  renderPagination(totalPages)
}

/**
 * Render the product catalog
 * @param {Array} products Product list
 */
function renderProducts(products) {
  const fragment = document.createDocumentFragment()

  products.forEach(product => {
    const data = {
      productId: product.id,
      src: product.url_image,
      name: product.name,
      category: product.Category.name,
      price: product.price,
      discount: product.discount,
    }
    fragment.appendChild(Product(data))
  })

  catalogList.innerHTML = ''
  catalogList.append(fragment)
  catalogList.removeEventListener('click', addCart)
  catalogList.addEventListener('click', addCart)
}

/**
 * Renders the pagination component
 * @param {Number} totalPages Total pages
 */
function renderPagination(totalPages) {
  
  paginationContainer.removeEventListener('click', changePage)
  paginationContainer.addEventListener('click', changePage)
  paginationContainer.innerHTML = ''
  paginationContainer.appendChild(Pagination(totalPages))
}

function onChangeSearchBar(event) {
  const { value } = event.target
  clearTimeout(getState('timeoutId'))
  
  const timeoutId = setTimeout(() => {
    setState('set-search', value)
  }, 750)
  setState('set-timeoutId', timeoutId)
}

/**
 * Search products by keyword
 */
function searchProducts() {
  const keyword = getState('search')

  productService.getProducts({keyword})
    .then(({ products, total }) => {
      setState('set-products', { products, totalProducts: total })
      setState('set-page', 1)
    })
    .catch(() => {
      setState('set-products', { products: [], totalProducts: 0 })
      setState('set-page', 1)
    })
}

/**
 * Search products by categoryId
 * @param {EventListenerOrEventListenerObject} event 
 */
function getProductsByCategory(event) {
  //close dropdown menu
  document.querySelector('#slideout-categories').classList.remove('active')
  
  const categoryId = event.target.dataset.category
  if(categoryId) {
    setState('set-searchCategory', categoryId)
    productService.getProducts({categoryId})
    .then(({ products, total }) => {
      setState('set-products', { products, totalProducts: total })
      setState('set-page', 1)
    })
    .catch(() => {
      setState('set-products', { products: [], totalProducts: 0 })
      setState('set-page', 1)
    })
  }
}

(function main() {
  //all queries
  const query = {}
  //query to search
  const filteredQuery = {}

  //get categoryId, keyword from URL 
  const searchParams = new URLSearchParams(window.location.search)
  query.categoryId = searchParams.get("categoryId")
  query.keyword = searchParams.get("search")
  
  //filter query
  for(const key in query) {
    if(query[key]) filteredQuery[key] = query[key]
  }

  productService.getProducts(filteredQuery)
    .then(({ products, total }) => {
      setState('set-products', { products, totalProducts: total })
    })
    .catch(() => {
      setState('set-products', { products: [], totalProducts: 0 })
    })

    
  const products = cartService.getCart()
  setState('set-cart', products)

  //listener search-bar
  document.querySelector('#search-bar')
  .addEventListener('input', onChangeSearchBar)
  
  //listener categories-list
  document.querySelector('#categories-list')
    .addEventListener('click', getProductsByCategory)
})()