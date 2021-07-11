
//styles
import '../styles/Products.scss'

//header functions
import './header'

//service
import * as productService from '../services/product'
import * as cartService from '../services/cart'

let state = {
  product: {},
  cart: [],
}

function getState(key) {
  return state[key]
}

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
    default:
      null
  }
}

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


function addProduct() {
  setState('add-cart')
}


(function main() {
  //get productId from URL 
  const productId = new URLSearchParams(window.location.search)
  .get("productId")

  const products = cartService.getCart()
  setState('set-cart', products)
  
  try {
    productService.getProductById(productId)
      .then(product => {
        setState('set-product', product)
      })
      .catch(error => {
        setState('set-product', {})
      })

    const buttonCart = document.querySelector('#product-cart')
    buttonCart.addEventListener('click', addProduct)
    
  } catch (error) {
    const productContainer = document.querySelector('#product-container')
    productContainer.innerText = "PRODUCT NOT FOUND"
  }
})()
