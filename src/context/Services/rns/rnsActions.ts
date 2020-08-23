import { RnsFilter } from 'api/models/RnsFilter'
import { RnsItem } from 'models/marketItems/DomainItem'
import { ContextPayload, ContextDispatch } from 'context/storeUtils/interfaces'
import { RnsOrder, RnsState } from './interfaces'

export type RNS_ACTION = 'FILTER' | 'SET_LISTING' | 'OUTDATE' | 'SET_ORDER' | 'REFRESH' | 'SET_PROGRESS' | 'CLEAR_ORDER' | 'UPDATE_LIMITS'

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

export type OrderPayload = RnsOrder<RnsItem>

export type ProgressPayload = Pick<RnsOrder<RnsItem>, 'isProcessing'>

export type LimitsPayload = Partial<Pick<RnsFilter, 'price'>>

export type RnsPayload = ContextPayload |
  FilterPayload |
  ListingPayload |
  OutdatePayload |
  OrderPayload |
  ProgressPayload |
  LimitsPayload |
  RefreshPayload

export type RnsAction = ContextDispatch<RNS_ACTION, RnsPayload>

export interface RnsReducer<P extends RnsPayload> {
  (state: RnsState, payload: P): RnsState
}

export type RnsActions = {
  FILTER: RnsReducer<FilterPayload>
  UPDATE_LIMITS: RnsReducer<LimitsPayload>
  SET_LISTING: RnsReducer<ListingPayload>
  OUTDATE: RnsReducer<OutdatePayload>
  REFRESH: RnsReducer<RefreshPayload>
  SET_ORDER: RnsReducer<OrderPayload>
  SET_PROGRESS: RnsReducer<ProgressPayload>
  CLEAR_ORDER: RnsReducer<{}>
}

export const rnsActions: RnsActions = {
  FILTER: (state, payload) => ({
    ...state,
    filters: {
      ...state.filters,
      ...payload,
    },
  }),
  UPDATE_LIMITS: (state, payload) => ({
    ...state,
    limits: {
      ...state.limits,
      ...payload,
    },
  }),
  SET_LISTING: (state, payload) => {
    const { items } = payload

    return {
      ...state,
      listing: {
        items,
        outdatedTokens: [],
      },
    }
  },
  OUTDATE: (state, payload) => {
    const { order, listing } = state
    const { tokenId } = payload

    if (order) {
      const { item } = order
      const { tokenId: itemTokenId } = item
      order.isOutdated = itemTokenId === tokenId
    }

    const { outdatedTokens } = listing
    const tokenSet = new Set([...outdatedTokens, tokenId])

    return {
      ...state,
      order,
      listing: {
        ...listing,
        outdatedTokens: Array.from(tokenSet) as [], // TS2322 Type 'number' is not assignable to type '0'
      },
    }
  },
  REFRESH: (state, { refresh }) => ({
    ...state,
    needsRefresh: refresh,
  }),
  SET_ORDER: (state, payload) => ({
    ...state, order: payload,
  }),
  SET_PROGRESS: (state, { isProcessing }) => ({
    ...state,
    order: state.order && {
      ...state.order,
      isProcessing,
    },
  }),
  CLEAR_ORDER: (state, _) => ({
    ...state,
    order: undefined,
  }),
}
