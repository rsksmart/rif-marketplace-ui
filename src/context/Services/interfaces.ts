import { ContextState } from 'context/storeUtils/interfaces'

export interface ServiceOrder<T> {
  item: T
  isProcessing: boolean
  isOutdated: boolean
}

export interface ServiceListing<T> {
  items: T[]
  outdatedTokens: []
}

export interface ServiceState<T> extends ContextState {
  listing: ServiceListing<T>
  order: ServiceOrder<T>
  needsRefresh?: boolean
}
