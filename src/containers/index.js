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

const catalogList = document.querySelector('#catalog-list')
const paginationContainer = document.querySelector('#pagination-container')
const listContainer = document.querySelector('#categories-list')

//initial state
let state = {
  products: [],
  page: 1,
  search: '',
  searchCategory: '',
  cart: [],
  totalPages: 0,
  timeoutId: null,
}

function getState(key) {
  return state[key]
}

function setState(action, payload) {

  switch (action) {
    case 'set-products':
      state = {
        ...state,
        products: payload.products,
        totalPages: payload.totalPages,
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

function changePage(event) {
  const page = event.target.dataset.page || event.target.parentNode.dataset.page
  let isNewPage = false
  const currentPage = getState('page')
  const totalPages = getState('totalPages')
  
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
    productService.getProducts(keyword, page, categoryId)
      .then(({ products, total }) => {
        setState('set-products', { products, totalPages: Math.ceil(total / 10) })
        setState('set-page', page)
      })
      .catch(() => {
        setState('set-products', { products: [], totalPages: 0 })
        setState('set-page', 1)
      })
    window.scrollTo(0, 0)
  }
}

function addCart(event) {
  const action = event.target.dataset.action || event.target.parentNode.dataset.action
  if(action === 'add') {
    const productId = event.target.dataset.product || event.target.parentNode.dataset.product

    setState('update-cart', productId)
  }
}

function renderCatalog() {
  const products = getState('products')
  const totalPages = getState('totalPages')

  renderProducts(products)
  renderPagination(totalPages)
}

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
  }, 1000)
  setState('set-timeoutId', timeoutId)
}

function searchProducts() {
  const keyword = getState('search')

  productService.getProductsByKeyword(keyword)
    .then(({ products, total }) => {
      setState('set-products', { products, totalPages: Math.ceil(total / 10) })
      setState('set-page', 1)
    })
    .catch(() => {
      setState('set-products', { products: [], totalPages: 0 })
      setState('set-page', 1)
    })
}

function getProductsByCategory(event) {
  const categoryId = event.target.dataset.category
  if(categoryId) {
    setState('set-searchCategory', categoryId)
    productService.getProductsByCategory(categoryId)
    .then(({ products, total }) => {
      setState('set-products', { products, totalPages: Math.ceil(total / 10) })
      setState('set-page', 1)
    })
    .catch(() => {
      setState('set-products', { products: [], totalPages: 0 })
      setState('set-page', 1)
    })
  }
}

(function main() {
  productService.getProducts()
    .then(({ products, total }) => {
      setState('set-products', { products, totalPages: Math.ceil(total / 10) })
    })
    .catch(() => {
      setState('set-products', { products: [], totalPages: 0 })
    })
    
  const products = cartService.getCart()
  setState('set-cart', products)

  //listener search bar
  const searchBar = document.querySelector('#search-bar')
  searchBar.addEventListener('input', onChangeSearchBar)

  listContainer.addEventListener('click', getProductsByCategory)
})()