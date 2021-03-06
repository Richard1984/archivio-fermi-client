import axios from 'axios'

import getUrl from './getUrl'

const env = process.env.NODE_ENV

export default axios.create({
  baseURL: getUrl(env),
  withCredentials: true,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
})
