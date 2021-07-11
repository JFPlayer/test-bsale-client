
//styles
import '../styles/Cart.scss'

//utils
import * as cartService from '../services/cart'
// import { getCart } from '../utils/getCart'

//template
import CartProduct from '../templates/CartProduct'

//header functions
import './header'

let state = {
  cart: [],
}

const getState = key => {
  return state[key]
}

const setState = (action, payload) => {
  switch (action) {
    case 'set-cart':
      state = {
        ...state,
        cart: payload
      }
      renderProducts()
      break
    default:
      null
  }
}

function actionCart (event) {
  const { action, productId } = event.target.dataset

  if(!action) return;

  const updatedCart = cartService.updateProductCart(productId, action)
  setState('set-cart', updatedCart)
}

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

(function main() {
  setState('set-cart', cartService.getCart())
})()