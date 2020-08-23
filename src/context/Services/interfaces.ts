import { ContextState } from "context/storeUtils/interfaces";
import { LISTING_ACTION } from "./storage/listingActions";
import { STORAGE_ACTION } from "./storage/storageActions";
import { RNS_ACTION } from "./rns/rnsActions";

export type SERVICE_ACTION = LISTING_ACTION | STORAGE_ACTION | RNS_ACTION

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
