import { RnsFilter } from 'api/models/RnsFilter'
import { RnsItem } from 'models/marketItems/DomainItem'
import { Dispatch } from 'react'
import { StoreState } from 'store/storeUtils/interfaces'
import { StoreName as DomainsStoreName } from './DomainsStore'
import { StoreName as OffersStoreName } from './OffersStore'
import { StoreName as SoldStoreName } from './SoldStore'
import { RnsAction } from './rnsActions'

export type RnsStoreNames = DomainsStoreName | OffersStoreName | SoldStoreName

export interface RnsOrder<T> {
  item: T
  isProcessing: boolean
  isOutdated: boolean
}

export interface RnsListing<T> {
  items: T[]
  outdatedTokens: []
}

export interface RnsState extends StoreState {
  listing: RnsListing<RnsItem>
  filters: Partial<RnsFilter>
  limits?: Partial<RnsFilter>
  order?: RnsOrder<RnsItem>
  needsRefresh: boolean
}

export interface RnsStoreProps {
  state: RnsState
  dispatch: Dispatch<RnsAction>
}
