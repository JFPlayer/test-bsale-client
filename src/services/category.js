import axios from 'axios'

const API_ENDPOINT = '/api/categories'

export const getCategories = () => {
  
  return axios.get(API_ENDPOINT)
    .then(({data}) => data.body)
    .catch((error) => {
      throw new Error(error)
    })
}