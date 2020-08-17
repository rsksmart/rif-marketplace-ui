import { StoreState } from 'store/storeUtils/interfaces'

export interface ServiceStoreOrder<T> {
    item: T
    isProcessing: boolean
    isOutdated: boolean
}

export interface ServiceStoreListing<T> {
    items: T[]
    outdatedTokens: []
}

export interface ServiceStoreState<T> extends StoreState {
  listing: ServiceStoreListing<T>
  order: ServiceStoreOrder<T>
  needsRefresh?: boolean
}
