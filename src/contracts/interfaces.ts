import { TransactionReceipt } from 'web3-eth'
import Web3 from 'web3'

import {
  SupportedTokens, SYSTEM_SUPPORTED_TOKENS, SYSTEM_TOKENS, Token, TokenRecord,
} from 'models/Token'
import { RifERC20Contract } from './tokens/rif'
import { MarketplaceContractErrorId } from './rns/Marketplace'
import { RnsContractErrorId } from './rns/Rns'
import { StorageStakingContractErrorId } from './storage/Staking'
import { StorageContractErrorId } from './storage/Storage'
import type { RifERC677ContractErrorId, RifERC20ContractErrorId } from './tokens/rif'
import { PaymentWrapper } from './wrappers/payment-wrapper'

export interface TransactionOptions {
  from?: string
  gas?: number
  gasPrice?: string
  value?: string | number
}

export interface ERC20ContractI extends PaymentWrapper{ // FIXME: no use of "I" in interface naming
  approve (
      address: string, amount: string | number, options: TransactionOptions
  ): Promise<TransactionReceipt>
}

export type Web3ErrorId = 'web3-getGasPrice'

export type ContractErrorId =
  | Web3ErrorId
  | MarketplaceContractErrorId
  | RifERC677ContractErrorId
  | RifERC20ContractErrorId
  | RnsContractErrorId
  | StorageContractErrorId
  | StorageStakingContractErrorId

export enum TOKEN_TYPES {
  ERC20 = 'erc20',
  NATIVE = 'native'
}

export type TokenTypes = TOKEN_TYPES.NATIVE | TOKEN_TYPES.ERC20

export type SingletonContract = { getInstance(web3: Web3): any }

export type NFT = Token & {
  type: TokenTypes
  tokenContract: SingletonContract
}

export type TxOptions = TransactionOptions & {
  gasMultiplier?: number
  token?: SupportedTokens
  onApprove?: (receipt: TransactionReceipt) => void
}

export const NFT_RECORDS: TokenRecord<NFT> = {
  [SYSTEM_SUPPORTED_TOKENS.rbtc]: {
    ...SYSTEM_TOKENS.rbtc,
    type: TOKEN_TYPES.NATIVE,
  } as NFT,
  [SYSTEM_SUPPORTED_TOKENS.rif]: {
    ...SYSTEM_TOKENS.rif,
    type: TOKEN_TYPES.ERC20,
    tokenContract: RifERC20Contract,
  },
}
