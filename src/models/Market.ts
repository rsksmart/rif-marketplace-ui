import { RnsFilter } from 'api/models/RnsFilter'
import { XRFilter } from 'api/rif-marketplace-cache/rates/xr'
import Big from 'big.js'
import { SYSTEM_SUPPORTED_SYMBOL, TokenRecord } from 'models/Token'
import { RnsItem } from './marketItems/DomainItem'
import { StorageItem } from './marketItems/StorageItem'
import { BaseToken } from './Token'

export interface Item {
  id: string
}

export type MarketItem = RnsItem & StorageItem

export type MarketFilterType = RnsFilter & XRFilter

export type TokenXR = BaseToken & {
  rate: number
}

export type MarketCryptoRecord = TokenRecord<TokenXR>

// different quotations for different symbols
export type QuotationPerToken = Record<SYSTEM_SUPPORTED_SYMBOL, Big>
