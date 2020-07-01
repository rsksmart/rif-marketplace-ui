import { RnsState } from 'store/Market/rns/interfaces'
import { FilterPayload, ListingPayload, OrderPayload, ProgressPayload, RefreshPayload, RnsPayload, RNS_ACTIONS } from './rnsActions'


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
      ...payload
    }
  }),
  SET_LISTING: (state: RnsState, payload: ListingPayload) => {
    const { items } = payload

    return {
      ...state,
      listing: {
        items,
        outdatedTokens: []
      }
    }
  },
  OUTDATE: (state: RnsState, payload: RefreshPayload) => {
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
        outdatedTokens: Array.from(tokenSet) as [] // TS2322 Type 'number' is not assignable to type '0'
      }
    }
  },
  REFRESH: (state: RnsState, _: RnsPayload) => ({
    ...state,
    listing: {
      ...state.listing,
      outdatedTokens: []
    }
  }),
  SET_ORDER: (state: RnsState, payload: OrderPayload) => ({
    ...state, order: payload
  }),
  SET_PROGRESS: (state: RnsState, { isProcessing }: ProgressPayload) => ({
    ...state,
    order: state.order && {
      ...state.order,
      isProcessing
    }
  })
  // ito - Add remain ing actions: [ CLEAN_LISTING, CLEAN_ORDER ]
}