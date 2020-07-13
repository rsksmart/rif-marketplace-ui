import { Application, Service } from '@feathersjs/feathers'
import client from 'api/rif-marketplace-cache/config'
import { MarketFilterType } from 'models/Market'
import { ErrorReporterError } from 'store/App/AppStore'
import { ServiceAddress } from './serviceAddresses'

export type APIError = 'service-connection' | 'service-event-attach' | 'service-fetch'

export interface ServiceEventListener {
  (...args: any[]): void
}

// export interface ConnectServiceArgs {
//   newClient?: Application<any>
//   onError?: Function
// }

// export interface FetchArgs {
//   filters?: MarketFilterType | any
//   onError?: Function
// }
export interface ErrorReporter {
  (e: ErrorReporterError): void
}

export interface APIService {
  path: string
  service: Service<any>
  connect: (errorReporter: ErrorReporter, newClient?: Application<any>) => string | undefined
  fetch: (filters?: MarketFilterType | any) => Promise<any>
  // _fetch: (filters?: MarketFilterType | any) => Promise<any>
  attachEvent: (name: string, callback: ServiceEventListener) => void
  detachEvent: (name: string) => void
  errorReporter: ErrorReporter
}

export abstract class AbstractAPIService implements Omit<APIService, 'fetch'> {
  path!: string

  service!: Service<any>

  errorReporter!: ErrorReporter

  protected _fetch!: (filters?: MarketFilterType | any) => Promise<any>

  fetch = async (filters?: MarketFilterType | any): Promise<any> => {
    if (!this.service) {
      this.errorReporter({
        id: 'service-connection',
        text: 'Error while fetching data. The confirmations service is not connected',
      })
    }
    let data = []
    try {
      data = await this._fetch(filters)
    } catch (e) {
      this.errorReporter({
        id: 'service-fetch',
        text: `Error while fetching data. ${e.message}`,
      })
    }
    return data
  }

  connect = (errorReporter: ErrorReporter, newClient?: Application<any>) => {
    const app = newClient || client
    this.errorReporter = errorReporter

    try {
      this.service = app.service(this.path)
      return this.path
    } catch (e) {
      this.errorReporter({
        id: 'service-connection',
        text: `Error while connecting to service. ${e.message}`,
      })
      return undefined
    }
  }

  attachEvent = (name: string, callback: ServiceEventListener) => {
    try {
      this.service.on(name, callback)
    } catch (e) {
      this.errorReporter({
        id: 'service-event-attach',
        text: `Error attempting to attach to an api event. ${e.message}`,
      })
    }
  }

  detachEvent!: (name: string) => void
}

export type ServiceMap = Record<ServiceAddress, APIService>
