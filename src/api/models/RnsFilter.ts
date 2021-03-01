import { MinMaxFilter } from 'models/Filters'

export type DomainsSaleStatus = 'owned' | 'placed' | 'sold'

export interface RnsFilter {
  price: MinMaxFilter
  name?: string
  status: DomainsSaleStatus
  ownerAddress?: string
  expirationDate?: Date
}

export enum SORT_DIRECTION {
  'asc' = 1,
  'desc' = -1,
}

export type RnsSort = {
  price?: SORT_DIRECTION
  name?: SORT_DIRECTION
}
