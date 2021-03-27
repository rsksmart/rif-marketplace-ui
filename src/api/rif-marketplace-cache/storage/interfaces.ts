import { Modify } from 'utils/typeUtils'
import { APIService } from 'api/models/apiService'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem } from 'models/marketItems/StorageItem'
import { offersAddress, OffersAddress } from './offers'
import { storageStakesAddress, StorageStakesAddress } from './stakes'
import { avgBillingPlanAddress, AvgBillingPlanAddress } from './avg-billing-plan-price'
import { agreementsAddress, AgreementsAddress } from './agreements'
import { availableCapacityAddress, AvailableCapacityAddress } from './available-size'
import { StakeFilters } from '../common/stakes'

export type StorageServiceAddress =
  | OffersAddress
  | AvgBillingPlanAddress
  | StorageStakesAddress
  | AgreementsAddress
  | AvailableCapacityAddress

export const storageAddresses = [
  offersAddress,
  avgBillingPlanAddress,
  storageStakesAddress,
  agreementsAddress,
  availableCapacityAddress,
]

export type StorageWSChannel = 'offers' | 'agreements' | 'stakes'

export type StorageAPIService = Modify<
  APIService,
  {
    path: StorageServiceAddress
    _channel: StorageWSChannel
    fetch: (filters: Partial<StorageOffersFilters | AgreementFilters>) => Promise<StorageItem[]>
  }
>

export type StakeAPIService = Modify<
  APIService,
  {
    path: StorageServiceAddress
    _channel: StorageWSChannel
    fetch: (filters: StakeFilters) => Promise<any[]>
  }
>

export type AgreementFilters = (
  | {
    consumer: string
    provider?: never
  }
  | {
    consumer?: never
    provider: string
  }
)
