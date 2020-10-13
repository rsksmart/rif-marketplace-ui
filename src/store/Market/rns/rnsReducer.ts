import { RnsState } from 'store/Market/rns/interfaces'
import {
  FilterPayload, ListingPayload, OrderPayload,
  ProgressPayload, OutdatePayload, RnsPayload,
  RNS_ACTIONS, LimitsPayload, RefreshPayload, PagePayload,
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
    pagination: {
      ...state.pagination,
      page: 0,
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
  UPDATE_PAGE: (state: RnsState, { limit, skip, total }: PagePayload) => {
    const { pagination: { current } } = state

    if (!current || total !== current.total) {
      return {
        ...state,
        pagination: {
          current: { limit, skip, total },
          next: { limit, skip: skip + limit, total },
        },
      }
    }

    if (skip > current.skip) {
      const nextPage = skip + limit

      return {
        ...state,
        pagination: {
          ...state.pagination,
          previous: current,
          current: { limit, skip, total },
          next: {
            limit,
            skip: nextPage >= total ? skip : nextPage,
            total,
          },
        },
      }
    }

    if (skip < current.skip) {
      const prevPage = skip - limit

      return {
        ...state,
        pagination: {
          ...state.pagination,
          previous: {
            limit,
            skip: prevPage,
            total,
          },
          current: { limit, skip, total },
          next: current,
        },
      }
    }

    return state
  },
  NEXT_PAGE: (state: RnsState, _: RnsPayload) => {
    const { pagination: { next } } = state

    if (!next || next.skip >= next.total) {
      return state
    }

    return {
      ...state,
      pagination: {
        ...state.pagination,
        page: next.skip,
      },
    }
  },
  PREV_PAGE: (state: RnsState, _: RnsPayload) => {
    const { pagination: { previous } } = state

    if (!previous || previous.skip < 0) {
      return state
    }

    return {
      ...state,
      pagination: {
        ...state.pagination,
        page: previous.skip,
      },
    }
  },
}
