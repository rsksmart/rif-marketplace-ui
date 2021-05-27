import { Application, Paginated, Service } from '@feathersjs/feathers'
import { AuthenticationResult } from '@feathersjs/authentication'
import { MarketFilterType } from 'models/Market'
import createClient from 'api/client'
import { ErrorReporterError } from 'context/App/errorReporter'
import Logger from 'utils/Logger'
import { ServiceAddress } from './serviceAddresses'

export type APIErrorId = 'service-connection' | 'service-event-attach' | 'service-fetch' | 'service-post'

export interface ServiceEventListener {
  (...args: any[]): void
}

export interface ErrorReporter {
  (e: ErrorReporterError): void
}

export type MapFromTransport<Transport, Local> = (item: Transport) => Local

export type ServiceMetadata = Omit<Paginated<never>, 'data'>

export const isServiceMetadata = (
  metadata: ServiceMetadata | unknown,
): metadata is ServiceMetadata => Boolean((metadata as ServiceMetadata)?.total)

export type ConnectOptions = {
  client: ReturnType<typeof createClient>
}
export interface APIService {
  path: string
  _channel: string
  meta: ServiceMetadata | unknown
  service: Service<any>
  authenticate: (ownerAddress: string) => Promise<AuthenticationResult | void>
  connect: (errorReporter: ErrorReporter, options?: ConnectOptions) => string | undefined
  fetch: (filters?: MarketFilterType | any) => Promise<any>
  _fetch: (filters?: MarketFilterType | any) => Promise<any>
  attachEvent: (name: string, callback: ServiceEventListener) => void
  detachEvent: (name: string) => void
  errorReporter: ErrorReporter
}

export const isResultPaginated = <T>(
  result: Paginated<T> | [],
): result is Paginated<T> => Boolean((result as Paginated<T>)?.data)

export abstract class AbstractAPIService implements Omit<APIService, 'fetch'> {
  private _client: Application

  path!: string

  _channel!: string

  service!: Service<any>

  errorReporter: ErrorReporter = ({ error, id }) => Logger.getInstance()
    .error('Error reporter not implemented', id, error)

  _meta?: ServiceMetadata

  get meta(): ServiceMetadata | unknown {
    return this._meta
  }

  set meta(meta: ServiceMetadata | unknown) {
    this._meta = isServiceMetadata(meta) ? meta : undefined
  }

  constructor(client: ReturnType<typeof createClient>) {
    this._client = client
  }

  abstract _fetch: (filters?: MarketFilterType | any) => Promise<any>

  fetch = async (filters?: MarketFilterType | any): Promise<any> => {
    if (!this.service) {
      this.errorReporter({
        id: 'service-connection',
        text: 'Error while fetching data.',
        error: new Error(`The ${this.path} service is not connected`),
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

  connect = (
    errorReporter: ErrorReporter,
    options?: ConnectOptions,
  ): string | undefined => {
    this._client = options?.client || this._client
    this.errorReporter = errorReporter

    try {
      this.service = this._client.service(this.path)
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

  authenticate = (
    ownerAddress: string,
  ): Promise<AuthenticationResult | void> => this._client
    .authenticate({
      strategy: 'anonymous',
      channels: [this._channel],
      ownerAddress,
    }).catch((error) => {
      this.errorReporter({
        id: 'service-event-attach',
        text: 'Error attempting to authenticate with the api.',
        error,
      })
    })

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
