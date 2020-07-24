import { Application, Service } from '@feathersjs/feathers'
import { AuthenticationResult } from '@feathersjs/authentication'
import client from 'api/rif-marketplace-cache/config'
import { MarketFilterType } from 'models/Market'
import { ErrorReporterError } from 'store/App/AppStore'
import { ServiceAddress } from './serviceAddresses'

export type APIErrorId = 'service-connection' | 'service-event-attach' | 'service-fetch'

export interface ServiceEventListener {
  (...args: any[]): void
}

export interface ErrorReporter {
  (e: ErrorReporterError): void
}

export interface APIService {
  path: string
  _channel: string
  service: Service<any>
  authenticate: (ownerAddress: string) => Promise<AuthenticationResult | undefined>
  connect: (errorReporter: ErrorReporter, newClient?: Application<any>) => string | undefined
  fetch: (filters?: MarketFilterType | any) => Promise<any>
  _fetch: (filters?: MarketFilterType | any) => Promise<any>
  attachEvent: (name: string, callback: ServiceEventListener) => void
  detachEvent: (name: string) => void
  errorReporter: ErrorReporter
}

export abstract class AbstractAPIService implements Omit<APIService, 'fetch'> {
  path!: string
  _channel!: string

  service!: Service<any>

  errorReporter!: ErrorReporter

  abstract _fetch: (filters?: MarketFilterType | any) => Promise<any>

  fetch = async (filters?: MarketFilterType | any): Promise<any> => {
    if (!this.service) {
      this.errorReporter({
        id: 'service-connection',
        text: 'Error while fetching data.',
        error: new Error('The confirmations service is not connected'),
      })
    }
    let data = []
    try {
      data = await this._fetch(filters)
    } catch (error) {
      this.errorReporter({
        id: 'service-fetch',
        text: 'Error while fetching data.',
        error,
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
    } catch (error) {
      this.errorReporter({
        id: 'service-connection',
        text: 'Error while connecting to service.',
        error,
      })
      return undefined
    }
  }

  authenticate = async (ownerAddress: string) => {
    try {
      return await client.authenticate({
        strategy: 'anonymous',
        channels: [
          this._channel
        ],
        ownerAddress
      })
    } catch (error) {
      this.errorReporter({
        id: 'service-event-attach',
        text: 'Error attempting to authenticate with the api.',
        error,
      })
    }
  }

  attachEvent = (name: string, callback: ServiceEventListener) => {
    try {
      this.service.on(name, callback)
    } catch (error) {
      this.errorReporter({
        id: 'service-event-attach',
        text: 'Error attempting to attach to an api event.',
        error,
      })
    }
  }

  detachEvent!: (name: string) => void
}

export type ServiceMap = Record<ServiceAddress, APIService>
