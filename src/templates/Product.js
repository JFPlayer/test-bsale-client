
const productTemplate = ({ productId, src, name, price }) => {
  //container
  const product = document.createElement('div')
  product.className = 'product'
  
  //product a
  const productLink = document.createElement('a')
  productLink.href = `/product.html?productId=${productId}`

  //product__image
  const productImage = document.createElement('div')
  productImage.className = 'product__image'

  let productImageImg;

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
  
  const productTitleSpan = document.createElement('span')
  productTitleSpan.innerText = name

  productTitle.appendChild(productTitleSpan)

  //append productLink
  productLink.append(productImage, productTitle)

  //product__description
  const productDescription = document.createElement('div')
  productDescription.className = 'product__description'

  //product__price
  const productDescriptionPrice = document.createElement('span')
  productDescriptionPrice.innerText = `$${price.toLocaleString('de-DE')}`
  productDescriptionPrice.className = 'product__price'

  //product__cart
  const productDescriptionCart = document.createElement('button')
  productDescriptionCart.className = 'product__cart'
  productDescriptionCart.dataset.action = 'add'
  productDescriptionCart.dataset.product = productId
  productDescriptionCart.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 193.056 193.056" style="enable-background:new 0 0 193.056 193.056;" xml:space="preserve">
              <g>
                <g>
                  <g>
                    <path d="M163.972,147.499H63.367l-2.13-8.714H175.25l16.571-72.198l-14.832-3.406l-13.863,60.387H57.893l-10.056-55.55L36.184,0
                      H1.235v15.217h22.116l5.694,33.234l-0.211,0.038l16.351,90.298h0.383l2.214,9.049c-10.774,1.798-19.021,11.164-19.021,22.44
                      c0,12.562,10.218,22.78,22.777,22.78c12.562,0,22.78-10.218,22.78-22.78c0-2.65-0.479-5.192-1.319-7.558h69.512
                      c-0.837,2.369-1.319,4.91-1.319,7.558c0,12.562,10.216,22.78,22.775,22.78c12.562,0,22.78-10.218,22.78-22.78
                      C186.754,157.718,176.534,147.499,163.972,147.499z M51.54,177.837c-4.17,0-7.56-3.393-7.56-7.563
                      c0-4.167,3.391-7.558,7.56-7.558s7.563,3.394,7.563,7.558C59.103,174.446,55.71,177.837,51.54,177.837z M163.972,177.84
                      c-4.169,0-7.558-3.393-7.558-7.563c0-4.167,3.391-7.558,7.558-7.558c4.172,0,7.563,3.393,7.563,7.558
                      C171.537,174.446,168.144,177.84,163.972,177.84z"/>
                    <path d="M102.376,103.527c0.276,0.276,0.583,0.5,0.893,0.728c1.331,0.981,2.906,1.501,4.489,1.501
                      c1.552,0,3.097-0.495,4.415-1.441c0.335-0.241,0.664-0.487,0.964-0.789l29.656-29.651c2.972-2.97,2.972-7.789,0-10.761
                      c-2.967-2.972-7.786-2.97-10.758,0l-16.668,16.665V31.966c0-4.202-3.406-7.609-7.609-7.609c-4.202,0-7.609,3.406-7.609,7.609
                      v47.812L83.481,63.113c-2.972-2.97-7.791-2.97-10.758,0c-2.972,2.97-2.972,7.789,0,10.761L102.376,103.527z"/>
                  </g>
                </g>
              </g>
              </svg>`

  productDescription.append(productDescriptionPrice, productDescriptionCart)

  product.append(productLink, productDescription)
  
  return product
}

export default productTemplate