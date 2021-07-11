const CartProduct = ({ productId, name, category, src, quantity, price, discount }) => {
  //product
  const productContainer = document.createElement('div')
  productContainer.className = 'product'
  //product__image
  const productImage = document.createElement('div')
  productImage.className = 'product__image'
  let productImageImg
  if(src) {
    productImageImg = document.createElement('img')
    productImageImg.src = src
    productImageImg.alt = name
  }else {
    productImageImg = document.createElement('div')
    productImageImg.innerText = 'NO IMAGE'
  }
  productImage.appendChild(productImageImg)
  //product__title
  const productTitle = document.createElement('div')
  productTitle.className = 'product__title'
  //product__title h2 h3
  const productTitleH2 = document.createElement('h2')
  const productTitleH3 = document.createElement('h3')
  productTitleH2.innerText = name
  productTitleH3.innerText = category
  
  productTitle.append(productTitleH2, productTitleH3)
  //product__info 
  const productInfo = document.createElement('div')
  productInfo.className = 'product__info'
  //info-quantity
  const infoQuantity = document.createElement('div')
  infoQuantity.className = 'info-quantity'
  //buttons
  const buttonSubstract = document.createElement('button')
  const quantityValue = document.createElement('div')
  const buttonAdd = document.createElement('button')
  buttonSubstract.innerText = '-'
  buttonSubstract.dataset.action = 'substract'
  buttonSubstract.dataset.productId = productId
  quantityValue.innerText = quantity
  buttonAdd.innerText = '+'
  buttonAdd.dataset.action = 'add'
  buttonAdd.dataset.productId = productId
  

  infoQuantity.append(buttonSubstract, quantityValue, buttonAdd)
  //info-price
  const infoPrice = document.createElement('div')
  infoPrice.className = 'info-price'
  //
  const priceTitle = document.createElement('span')
  const priceValue = document.createElement('span')
  priceTitle.innerText = 'Price: '
  const total = discount ? (100 - discount) * price : price
  priceValue.innerText = `$${total.toLocaleString('de-DE')}`

  infoPrice.append(priceTitle, priceValue)

  productInfo.append(infoQuantity, infoPrice)

  productContainer.append(productImage, productTitle, productInfo)
  
  return productContainer
}

export default CartProduct