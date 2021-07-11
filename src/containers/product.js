
//styles
import '../styles/Products.scss'

//header functions
import './header'

//service
import * as productService from '../services/product'
import * as cartService from '../services/cart'

/**
 * Initial state
 */
let state = {
  product: {},
  cart: [],
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
    case 'set-product':
      state = {
        ...state,
        product: payload
      }
      renderProduct()
      break
    case 'set-cart':
      state = {
        ...state,
        cart: payload
      }
      break
    case 'add-cart':
      let isRepeat = false
      const productFound = state.product
      
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
    case 'set-timeoutId':
      state = {
        ...state,
        timeoutId: payload
      }
      break
    default:
      null
  }
}

/**
 * Renders the product component
 */
const renderProduct = () => {
  const product = getState('product')
  //product__image
  const productImage = document.querySelector('#product-image')
  //product__image img
  let productImageImgElement

  if(product.url_image) {
    productImageImgElement = document.createElement('img')
    productImageImgElement.src = product.url_image
    productImageImgElement.alt = product.name
  }else {
    productImageImgElement = document.createElement('div')
    productImageImgElement.innerText = 'NO IMAGE'
  }

  productImage.appendChild(productImageImgElement)
  //product__title
  const productTitle = document.querySelector('#product-title')
  //product__title h1 h2
  const productTitleH1 = document.createElement('h1')
  const productTitleH2 = document.createElement('h2')
  productTitleH1.innerText = product.name
  productTitleH2.innerText = product.Category.name
  productTitle.append(productTitleH1, productTitleH2)
  //price-discount price-total
  const productDiscount = document.querySelector('#price-discount')
  const productTotal = document.querySelector('#price-total')
  const { price, discount } = product
  const priceTotal = discount ? (100 - discount) * price : price 
  productDiscount.innerHTML = discount ? `$${price.toLocaleString('de-DE')}` : ' '
  productTotal.innerHTML = `$${priceTotal.toLocaleString('de-DE')}`
}

/**
 * Adds product to cart
 */
function addProduct() {
  setState('add-cart')
}

/**
 * Change location to home page and search products by keyword
 * @param {EventListenerOrEventListenerObject} event 
 */
function searchProductsByKeywordFromIndex(event) {
  const { value } = event.target
  clearTimeout(getState('timeoutId'))
  
  const timeoutId = setTimeout(() => {
    window.location.assign(`/?search=${value}`)
  }, 1000)
  setState('set-timeoutId', timeoutId)
}

/**
 * Change location to home page and search products by categoryId
 * @param {EventListenerOrEventListenerObject} event 
 */
function searchProductsByCategoryFromIndex(event) {
  const categoryId = event.target.dataset.category
  if(categoryId) {
    window.location.assign(`/?categoryId=${categoryId}`)
  }
}

(function main() {
  //get productId from URL 
  const productId = new URLSearchParams(window.location.search)
    .get("productId")

  const products = cartService.getCart()
  setState('set-cart', products)
  
  productService.getProductById(productId)
    .then(product => {
      setState('set-product', product)
    })
    .catch(() => {
      setState('set-product', {})
      document.querySelector('#product-container').innerText = "PRODUCT NOT FOUND"
    })

  document.querySelector('#product-cart')
    .addEventListener('click', addProduct)

  //listener search-bar
  document.querySelector('#search-bar')
  .addEventListener('input', searchProductsByKeywordFromIndex)
  
  //listener category-menu
  document.querySelector('#categories-list')
    .addEventListener('click', searchProductsByCategoryFromIndex)
})()
