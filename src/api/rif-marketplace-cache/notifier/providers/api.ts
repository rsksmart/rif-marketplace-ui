import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import client from 'api/rif-marketplace-cache/client'
import { NotifierProvidersFilters } from 'models/marketItems/NotifierFilters'
import { Provider } from 'models/marketItems/NotifierItem'
import { NotifierCacheAPIService } from '../interfaces'
import { ProviderDTO } from '../subscriptions/models'

export const address = 'notifier/v0/providers' as const
export type Address = typeof address

export const wsChannel = 'notifier_providers' as const
export type WSChannel = typeof wsChannel

export const mapFromTransport = ({
  provider,
  url,
}: ProviderDTO): Provider => ({
  provider,
  url,
})

class ProvidersService extends AbstractAPIService
  implements NotifierCacheAPIService {
  path = address

  _channel = wsChannel

  constructor() {
    super(client)
  }

  _fetch = async (
    filters: NotifierProvidersFilters,
  ): Promise<Provider[]> => {
    const result: Paginated<Provider> = await this.service.find({
      query: filters && {
        ...filters,
      },
    })

    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data.map(mapFromTransport)
  }

  isUnregisteredURL = async (url: string): Promise<boolean> => {
    const result = await this.fetch({ url })

    if (result.length) {
      this.errorReporter({
        id: 'service-fetch',
        text: 'The URL is already registered',
        error: new Error('URL is already registered'),
      })
    }

    return !result.length
  }
}

export default ProvidersService
