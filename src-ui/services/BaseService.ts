import axios from 'axios'

export default class BaseService {
  protected baseUrl: string

  constructor() {
    this.baseUrl = ''
  }

  callAjax<T>(method: string, url: string, data = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      axios({
        method: method,
        url: url,
        data: data
      })
        .then((response) => {
          resolve(response.data as T)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
