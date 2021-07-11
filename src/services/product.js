import axios from 'axios'

const API_ENDPOINT = '/api/products'

// export function getProducts(limit = 10) {
//   return axios
//     .get(`${API_ENDPOINT}?limit=${limit}`)
//     .then(({data}) => {
//       return {
//         products: data.body.rows,
//         total: data.body.count,
//       } 
//     })
//     .catch(error => {
//       throw new Error(error)
//     })
// }

export function getProductsByKeyword(keyword = '', page = 1, limit = 10) {
  return axios
    .get(`${API_ENDPOINT}?limit=${limit}&page=${page}&search=${keyword}`)
    .then(({data}) => {
      return {
        products: data.body.rows,
        total: data.body.count,
      }
    })
    .catch(error => {
      throw new Error(error)
    })
}

export function getProducts(keyword = '', page = 1, categoryId = '', limit = 10) {
  return axios
    .get(`${API_ENDPOINT}?limit=${limit}&page=${page}&search=${keyword}&categoryId=${categoryId}`)
    .then(({data}) => {
      return {
        products: data.body.rows,
        total: data.body.count,
      }
    })
    .catch(error => {
      throw new Error(error)
    })
}

export function getProductsByCategory(id) {
  return axios
    .get(`${API_ENDPOINT}?categoryId=${id}`)
    .then(({data}) => {
      return {
        products: data.body.rows,
        total: data.body.count,
      }
    })
    .catch(error => {
      throw new Error(error)
    })
}

export function getProductById(id) {
  return axios
    .get(`${API_ENDPOINT}/${id}`)
    .then(({data}) => data.body)
    .catch(error => {
      throw new Error(error)
    })
}
