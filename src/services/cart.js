
export function updateProductCart(productId, action) {
  const products = getCart()

  const updatedCart = products.map(product => {
    if(product.id == productId) {
      return {
        ...product,
        quantity: action === 'add' ? product.quantity + 1 : product.quantity - 1
      }
    }
    return product
  })
  .filter(({quantity}) => quantity)

  localStorage.setItem('productsCart', JSON.stringify(updatedCart))
  
  return updatedCart
}


export function getCart() {
  const products = localStorage.getItem('productsCart')
  if(!products) return []
  return JSON.parse(products)
}

export function updateCart(products = []) {
  localStorage.setItem('productsCart', JSON.stringify(products))
} 
