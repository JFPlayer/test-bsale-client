import axios from 'axios'

/**
 * Categories endpoint
 */
const API_ENDPOINT = '/api/categories'

/**
 * Gets categories from api endpoint
 * @returns {Promise} categoryList
 */
export const getCategories = () => {
  
  return axios.get(API_ENDPOINT)
    .then(({data}) => data.body)
    .catch(() => [])
}