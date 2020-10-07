import { RnsFilter } from 'api/models/RnsFilter'
import { RnsItem } from 'models/marketItems/DomainItem'
import { Dispatch } from 'react'
import { StoreState } from 'store/storeUtils/interfaces'
import { ServiceMetadata } from 'api/models/apiService'
import { StoreName as DomainsStoreName } from './DomainsStore'
import { StoreName as OffersStoreName } from './OffersStore'
import { StoreName as SoldStoreName } from './SoldStore'
import { RnsAction } from './rnsActions'

export type RnsStoreNames = DomainsStoreName | OffersStoreName | SoldStoreName

export interface RnsOrder {
  item: RnsItem
  isProcessing: boolean
  isOutdated: boolean
}

export interface RnsListing {
  items: RnsItem[]
  outdatedTokens: []
}

export type PageState = {
  previous?: ServiceMetadata
  current?: ServiceMetadata
  next?: ServiceMetadata
  page?: number
}

export interface RnsState extends StoreState {
  listing: RnsListing
  filters: Partial<RnsFilter>
  limits?: Partial<RnsFilter>
  order?: RnsOrder
  needsRefresh: boolean
  pagination: PageState
}

export interface RnsStoreProps {
  state: RnsState
  dispatch: Dispatch<RnsAction>
}
