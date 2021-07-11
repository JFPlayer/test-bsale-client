import * as categoryService from '../services/category'
import CategoryItem from '../templates/Category'

const btnMenu = document.querySelector('#btn-menu')
const slideoutCategories = document.querySelector('#slideout-categories')
const listContainer = document.querySelector('#categories-list')

/**
 * 
 * @param {array} categories 
 */
function renderCategoryList(categories) {
  const fragment = document.createDocumentFragment()

  categories.forEach(category => {
    const data = {
      name: category.name,
      categoryId: category.id,
    }
    fragment.appendChild(CategoryItem(data))
  })

  listContainer.appendChild(fragment)
}



(function main() {
  btnMenu.addEventListener('click', () => {
    slideoutCategories.classList.toggle('active')
  })

  categoryService.getCategories()
    .then(categories => {
      renderCategoryList(categories)
    })
    .catch(error => {
      console.log(error)
    })
  
})()

// function getProductsByCategory(event) {
//   const categoryId = event.target.dataset.category
//   if(categoryId) {
    
//   }
// }

// listContainer.addEventListener('click', getProductsByCategory)