import BaseService from '@/services/BaseService'

export default class ExampleService extends BaseService {
  private endpointData: string

  constructor() {
    super()
    this.endpointData = '/todo'
  }

  getData() {
    return this.callAjax('GET', this.endpointData)
  }
}
