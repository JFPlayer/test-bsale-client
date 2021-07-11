const categoryTemplate = ({ categoryId, name}) => {
  const category = document.createElement('li')
  category.className = 'categories-item'
  category.dataset.category = categoryId
  category.innerText = name

  return category
}

export default categoryTemplate