import { ContextState } from 'context/storeUtils/interfaces'
import { RNS_ACTION } from './rns/rnsActions'
import { STORAGE_ACTION } from './storage/interfaces'

export type SERVICE_ACTION = STORAGE_ACTION | RNS_ACTION

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
