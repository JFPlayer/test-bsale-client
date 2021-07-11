const limit = 10

const createButtonPage = (inner, page) => {
  const button = document.createElement('button')
  button.innerHTML = inner || ''
  button.className = 'pagination__item'
  button.dataset.page = page
  return button
}

const Pagination = (totalPages) => {
  const container = document.createDocumentFragment()

  container.appendChild(createButtonPage(`<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.25 8.75L9.75 12L13.25 15.25"></path>
            </svg>`, 'back'))

  for(let i=0; i<totalPages; i++){
    container.appendChild(createButtonPage(i + 1, i + 1))
  }

  container.appendChild(createButtonPage(`<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.75 8.75L14.25 12L10.75 15.25"></path>
            </svg>`, 'forward'))
  
  
  return container
}

export default Pagination