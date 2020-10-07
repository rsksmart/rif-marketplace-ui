import { ServiceMetadata } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { RnsItem } from 'models/marketItems/DomainItem'
import { StorePayload, StoreDispatcher } from 'store/storeUtils/interfaces'
import { RnsOrder } from './interfaces'

export type RNS_ACTIONS = 'NOOP'
| 'FILTER'
| 'SET_LISTING'
| 'OUTDATE'
| 'SET_ORDER'
| 'REFRESH'
| 'SET_PROGRESS'
| 'CLEAR_ORDER'
| 'UPDATE_LIMITS'
| 'UPDATE_PAGE'
| 'NEXT_PAGE'
| 'PREV_PAGE'

export type FilterPayload = Partial<RnsFilter>

export interface ListingPayload {
  items: RnsItem[]
}

export interface OutdatePayload {
  tokenId: string
}

export interface RefreshPayload {
  refresh: boolean
}

export type OrderPayload = RnsOrder

export type ProgressPayload = Pick<RnsOrder, 'isProcessing'>

export type LimitsPayload = Partial<RnsFilter>

export type PagePayload = ServiceMetadata

export type RnsPayload = StorePayload &
  FilterPayload &
  ListingPayload &
  OutdatePayload &
  OrderPayload &
  ProgressPayload &
  LimitsPayload &
  RefreshPayload &
  PagePayload

export interface RnsAction extends StoreDispatcher<RnsPayload> {
  type: RNS_ACTIONS
}
