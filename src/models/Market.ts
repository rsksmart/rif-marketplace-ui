import { RnsFilter } from 'api/models/RnsFilter'
import { XRFilter } from 'api/rif-marketplace-cache/rates/xr'
import { TokenRecord } from 'models/Token'
import { RnsItem } from './marketItems/DomainItem'
import { StorageItem } from './marketItems/StorageItem'
import { Token } from './Token'

export interface Item {
  id: string
}

export type MarketItem = RnsItem & StorageItem

export interface MarketFilter { // FIXUS: We should either delete or fix this type
  [filterFieldName: string]: unknown
}

export type MarketFilterType = RnsFilter & XRFilter

export type TokenXR = Token & {
  rate: number
}

export type MarketCryptoRecord = TokenRecord<TokenXR> | {}
