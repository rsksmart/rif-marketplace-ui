import {
  Actions, PagePayload, RnsState, SortPayload,
} from './interfaces'

const rnsActions: Actions = {
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
  SET_ORDER: (state, order) => ({
    ...state, order,
  }),
  SET_PROGRESS: (state, { isProcessing }) => ({
    ...state,
    order: state.order && {
      ...state.order,
      isProcessing,
    },
  }),
  CLEAR_ORDER: (state) => ({
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
  NEXT_PAGE: (state: RnsState) => {
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
  PREV_PAGE: (state: RnsState) => {
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
  SET_SORT: (state: RnsState, sort: SortPayload) => ({
    ...state,
    sort,
  }),
}

export default rnsActions
