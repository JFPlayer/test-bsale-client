
//styles
import '../styles/Cart.scss'

//utils
import * as cartService from '../services/cart'
// import { getCart } from '../utils/getCart'

//template
import CartProduct from '../templates/CartProduct'

//header functions
import './header'

/**
 * Initial state
 */
let state = {
  cart: [],
  timeoutId: null,
}

/**
 * Gets a property value of the state by key
 * @param {String} key A property of the state
 * @returns {*} A property value of the state
 */
const getState = key => {
  return state[key]
}

/**
 * Updates the state by an action type and a value
 * @param {String} action Type of action
 * @param {*} payload 
 */
const setState = (action, payload) => {
  switch (action) {
    case 'set-cart':
      state = {
        ...state,
        cart: payload
      }
      renderProducts()
      break
    case 'set-timeoutId':
      state = {
        ...state,
        timeoutId: payload
      }
    default:
      null
  }
}


/**
 * Updates cart by action-type('add', 'substract') and productId
 * @param {EventListenerOrEventListenerObject} event 
 */
function actionCart (event) {
  const { action, productId } = event.target.dataset

  if(!action) return;

  const updatedCart = cartService.updateProductCart(productId, action)
  setState('set-cart', updatedCart)
}

/**
 * Renders product list
 */
function renderProducts() {
  const cartList = document.querySelector('#cart-list')
  const fragment = document.createDocumentFragment()

  const products = getState('cart')
  products.forEach(product => {
    const data = {
      productId: product.id,
      name: product.name, 
      category: product.Category.name, 
      src: product.url_image, 
      quantity: product.quantity, 
      price: product.price, 
      discount: product.discount
    }
    fragment.appendChild(CartProduct(data))
  })

  cartList.innerHTML = ''
  cartList.appendChild(fragment)

  cartList.addEventListener('click', actionCart)
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
  setState('set-cart', cartService.getCart())

  //listener search-bar
  document.querySelector('#search-bar')
  .addEventListener('input', searchProductsByKeywordFromIndex)
  
  //listener category-menu
  document.querySelector('#categories-list')
    .addEventListener('click', searchProductsByCategoryFromIndex)
})()