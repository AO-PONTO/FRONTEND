import axios from 'axios'

const apiBaseUrl = process.env.NEXT_PUBLIC_API

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      config.headers.token = tempUser.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
