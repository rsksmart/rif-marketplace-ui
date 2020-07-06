import { RnsState } from 'store/Market/rns/interfaces'
import {
  FilterPayload, ListingPayload, OrderPayload, ProgressPayload, OutdatePayload, RnsPayload, RNS_ACTIONS, LimitsPayload, RefreshPayload,
} from './rnsActions'

export interface RnsReducer {
  (state: RnsState, payload: RnsPayload): RnsState
}

export type RnsActions = {
  [key in RNS_ACTIONS]: RnsReducer
}

export const rnsActions: RnsActions = {
  NOOP: (state: RnsState, _: RnsPayload) => state,
  FILTER: (state: RnsState, payload: FilterPayload) => ({
    ...state,
    filters: {
      ...state.filters,
      ...payload,
    },
  }),
  UPDATE_LIMITS: (state: RnsState, payload: LimitsPayload) => ({
    ...state,
    limits: {
      ...state.limits,
      ...payload,
    },
  }),
  SET_LISTING: (state: RnsState, payload: ListingPayload) => {
    const { items } = payload

    return {
      ...state,
      listing: {
        items,
        outdatedTokens: [],
      },
    }
  },
  OUTDATE: (state: RnsState, payload: OutdatePayload) => {
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
  REFRESH: (state: RnsState, { refresh }: RefreshPayload) => ({
    ...state,
    needsRefresh: refresh,
  }),
  SET_ORDER: (state: RnsState, payload: OrderPayload) => ({
    ...state, order: payload,
  }),
  SET_PROGRESS: (state: RnsState, { isProcessing }: ProgressPayload) => ({
    ...state,
    order: state.order && {
      ...state.order,
      isProcessing,
    },
  }),
  CLEAR_ORDER: (state: RnsState, _: RnsPayload) => ({
    ...state,
    order: undefined,
  }),
}
