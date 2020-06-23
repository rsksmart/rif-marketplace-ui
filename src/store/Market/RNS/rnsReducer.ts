
import { RnsState } from 'store/Market/rns/interfaces'
import { RnsPayload, RNS_ACTIONS, FilterPayload, ListingPayload, RefreshPayload, OrderPayload } from './rnsActions'


export const rnsActions: RnsActions = {
  NOOP: (state: RnsState, _: RnsPayload) => state,
  FILTER: (state: RnsState, payload: FilterPayload) => ({
    ...state,
    filters: {
      ...payload
    }
  }),
  SET_LISTING: (state: RnsState, payload: ListingPayload) => {
    const { listing } = state
    const { items } = payload

    return {
      ...state,
      listing: {
        items,
        outdatedTokens: []
      }
    }
  },
  REFRESH_TOKENS: (state: RnsState, payload: RefreshPayload) => {
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
  SET_ORDER: (state: RnsState, payload: OrderPayload) => ({
    ...state, order: payload
  })
  // ito - Add remain ing actions: [ SET_PROGRESS, CLEAN_LISTING, CLEAN_ORDER ]
  // The CONNECT_SERVICE should not be necessary here; instead it should be done in the Store Provider component (viz BlockchainStore)
  // SET_EXCHANGE_RATE and TOGGLE_TX_TYPE should I guess stay in the marketReducer
}

export interface RnsReducer {
  (state: RnsState, payload: RnsPayload): RnsState
}

export type RnsActions = {
  [key in RNS_ACTIONS]: RnsReducer
}