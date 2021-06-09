import { AbstractAPIService } from './apiService'

export default abstract class AbstractRestAPIService extends AbstractAPIService {
    abstract _create: <T, S>(data: T, params?: S) => Promise<any>

    create = async <T, S> (data: T, params?: S): Promise<any> => {
      if (!this.service) {
        this.errorReporter({
          id: 'service-connection',
          text: 'Error while creating resource.',
          error: new Error(`The ${this.path} service is not connected`),
        })
      }
      let response = {}
      try {
        response = await this._create(data, params)
      } catch (error) {
        this.errorReporter({
          id: 'service-fetch',
          text: 'Error while creating resource.',
          error,
        })
      }
      return response
    }
}
