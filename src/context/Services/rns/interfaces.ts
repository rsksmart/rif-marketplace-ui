import { RnsFilter, RnsSort } from 'api/models/RnsFilter'
import { RnsItem } from 'models/marketItems/DomainItem'
import { ContextProps, ContextState } from 'context/storeUtils/interfaces'
import { ServiceMetadata } from 'api/models/apiService'
import { ContextName as DomainsContextName } from './DomainsContext'
import { ContextName as OffersContextName } from './OffersContext'
import { ContextName as SoldContextName } from './SoldContext'

export type RnsContextNames = DomainsContextName
  | OffersContextName
  | SoldContextName

// STATE
export type RnsOrder<T> = {
  item: T
  isProcessing?: boolean
  isOutdated?: boolean
}

export type RnsListing<T> = {
  items: T[]
  outdatedTokens: []
}

export type PageState = {
  previous?: ServiceMetadata
  current?: ServiceMetadata
  next?: ServiceMetadata
  page?: number
}

export interface RnsState extends ContextState {
  listing: RnsListing<RnsItem>
  filters: Partial<RnsFilter>
  limits?: Partial<RnsFilter>
  order?: RnsOrder<RnsItem>
  needsRefresh: boolean
  pagination: PageState
}

// PAYLOADS
export type FilterPayload = Partial<RnsFilter>

export type ListingPayload = {
  items: RnsItem[]
}

export type OutdatePayload = {
  tokenId: string
}

export type RefreshPayload = {
  refresh: boolean
}

export type OrderPayload = RnsOrder<RnsItem>

export type ProgressPayload = Pick<RnsOrder<RnsItem>, 'isProcessing'>

export type LimitsPayload = Partial<Pick<RnsFilter, 'price'>>

export type PagePayload = ServiceMetadata

export type SortPayload = RnsSort

// ACTIONS
export type Action = (
  | {
    type: 'FILTER'
    payload: FilterPayload
  }
  | {
    type: 'UPDATE_LIMITS'
    payload: LimitsPayload
  }
  | {
    type: 'SET_LISTING'
    payload: ListingPayload
  }
  | {
    type: 'OUTDATE'
    payload: OutdatePayload
  }
  | {
    type: 'SET_ORDER'
    payload: OrderPayload
  }
  | {
    type: 'REFRESH'
    payload: RefreshPayload
  }
  | {
    type: 'SET_PROGRESS'
    payload: ProgressPayload
  }
  | {
    type: 'CLEAR_ORDER'
  }
  | {
    type: 'UPDATE_LIMITS'
    payload: LimitsPayload
  }
  | {
    type: 'UPDATE_PAGE'
    payload: PagePayload
  }
  | {
    type: 'NEXT_PAGE'
  }
  | {
    type: 'PREV_PAGE'
  }
  | {
    type: 'SET_SORT'
    payload: SortPayload
  }
)

export type Actions = {
  FILTER: (state: RnsState, payload: FilterPayload) => RnsState
  UPDATE_LIMITS: (state: RnsState, payload: LimitsPayload) => RnsState
  SET_LISTING: (state: RnsState, payload: ListingPayload) => RnsState
  OUTDATE: (state: RnsState, payload: OutdatePayload) => RnsState
  REFRESH: (state: RnsState, payload: RefreshPayload) => RnsState
  SET_ORDER: (state: RnsState, payload: OrderPayload) => RnsState
  SET_PROGRESS: (state: RnsState, payload: ProgressPayload) => RnsState
  CLEAR_ORDER: (state: RnsState) => RnsState
  UPDATE_PAGE: (state: RnsState, payload: PagePayload) => RnsState
  NEXT_PAGE: (state: RnsState) => RnsState
  PREV_PAGE: (state: RnsState) => RnsState
  SET_SORT: (state: RnsState, payload: SortPayload) => RnsState
}

export type RnsContextProps = ContextProps<RnsState, Action>
