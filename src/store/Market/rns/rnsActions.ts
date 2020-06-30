import { RnsFilter } from "api/models/RnsFilter"
import { RnsItem } from "models/marketItems/DomainItem"
import { StorePayload, StoreDispatcher } from "store/storeUtils/interfaces"
import { RnsOrder } from "./interfaces"

export type RNS_ACTIONS = 'NOOP' | 'FILTER' | 'SET_LISTING' | 'REFRESH_TOKENS' | 'SET_ORDER' | 'CLEAR_REFRESH'

export type FilterPayload = Partial<RnsFilter>

export interface ListingPayload {
  items: RnsItem[]
}

export interface RefreshPayload {
  tokenId: string
}

export type OrderPayload = RnsOrder

export type RnsPayload = StorePayload & FilterPayload & ListingPayload & RefreshPayload & OrderPayload

export interface RnsAction extends StoreDispatcher<RnsPayload> {
  type: RNS_ACTIONS
}