import { Service, Application } from '@feathersjs/feathers'
import client from 'api/rif-marketplace-cache/config'
import { MarketFilter } from 'models/Market'

export interface ServiceEventListener {
  (...args: any[]): void
}

export interface APIController {
  path: string
  service: Service<any>
  connect: (newClient?: Application<any>) => string | undefined
  fetch: (filters?: MarketFilter) => Promise<any>
  attachEvent: (name: string, callback: ServiceEventListener) => void
  detachEvent: (name: string) => void
}

export abstract class AbstractAPIController implements Omit<APIController, 'fetch'> {
  path!: string

  service!: Service<any>

  connect = (clientOverride?: Application<any>) => {
    const app = clientOverride || client
    try {
      this.service = app.service(this.path)
      return this.path
    } catch (e) { // TODO: move error handling up a level
      return undefined
    }
  }

  attachEvent = (name: string, callback: ServiceEventListener) => {
    if (this.service) this.service.on(name, callback)
  }

  detachEvent!: (name: string) => void
}

export type ServiceMap = Record<string, APIController>
