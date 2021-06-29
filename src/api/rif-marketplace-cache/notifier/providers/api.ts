import { AbstractAPIService } from 'api/models/apiService'
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
    const data = await this.service.find({
      query: filters && {
        ...filters,
      },
    })

    return data.map(mapFromTransport)
  }

  isRegisteredURL = async (url: string): Promise<boolean> => {
    const { length: hasResult } = await this.fetch({ url })

    return hasResult
  }
}

export default ProvidersService
