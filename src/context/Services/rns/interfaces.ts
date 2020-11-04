import { RnsFilter } from 'api/models/RnsFilter'
import { RnsItem } from 'models/marketItems/DomainItem'
import { Dispatch } from 'react'
import { ContextState } from 'context/storeUtils/interfaces'
import { ServiceMetadata } from 'api/models/apiService'
import { ContextName as DomainsContextName } from './DomainsContext'
import { ContextName as OffersContextName } from './OffersContext'
import { ContextName as SoldContextName } from './SoldContext'
import { RnsAction } from './rnsActions'

export type RnsContextNames = DomainsContextName
| OffersContextName
| SoldContextName

export interface RnsOrder<T> {
  item: T
  isProcessing: boolean
  isOutdated: boolean
}

export interface RnsListing<T> {
  items: T[]
  outdatedTokens: []
}

export type PageState = {
  previous?: ServiceMetadata
  current?: ServiceMetadata
  next?: ServiceMetadata
  page?: number
}

export interface RnsState extends ContextState {
  listing: RnsListing<RnsItem>
  filters: Partial<RnsFilter>
  limits?: Partial<RnsFilter>
  order?: RnsOrder<RnsItem>
  needsRefresh: boolean
  pagination: PageState
}

export interface RnsContextProps {
  state: RnsState
  dispatch: Dispatch<RnsAction>
}
