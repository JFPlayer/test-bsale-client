import axios from 'axios'

/**
 * Products endpoint
 */
const API_ENDPOINT = '/api/products'

/**
 * Gets all products or filtered products from api endpoint
 * @param {Object} queryObject (keyword, page, categoryId, limit)  
 * @returns {Promise} productList
 */
export function getProducts({keyword = '', page = 1, categoryId = '', limit = 10}) {
  return axios
    .get(`${API_ENDPOINT}?limit=${limit}&page=${page}&search=${keyword}&categoryId=${categoryId}`)
    .then(({data}) => {
      return {
        products: data.body.rows,
        total: data.body.count,
      }
    })
    .catch(() => {
      return {
        products: [],
        total: 0,
      }
    })
}

/**
 * Gets product by id from api endpoint
 * @param {String|Number} id productId
 * @returns {Promise} product
 */
export function getProductById(id) {
  return axios
    .get(`${API_ENDPOINT}/${id}`)
    .then(({data}) => data.body)
    .catch(() => ({}))
}
