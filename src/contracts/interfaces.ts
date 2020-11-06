import { TransactionReceipt } from 'web3-eth'

import { RifERC20Contract } from './tokens/rif'
import { MarketplaceContractErrorId } from './Marketplace'
import { RnsContractErrorId } from './Rns'
import { StorageStakingContractErrorId } from './Staking'
import { StorageContractErrorId } from './storage/contract'
import type { RifERC677ContractErrorId, RifERC20ContractErrorId } from './tokens/rif'

export interface TransactionOptions {
  from?: string
  gas?: number
  gasPrice?: string
  value?: string | number
}

export interface ERC20ContractI {
  approve (
      address: string, amount: string | number, options: TransactionOptions
  ): Promise<TransactionReceipt>

  getBalanceOf (
      account: string, options: TransactionOptions
  ): Promise<string | number>
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

export enum SUPPORTED_TOKENS {
  RIF = 'rif',
  RBTC = 'rbtc'
}

export enum TOKEN_TYPES {
  ERC20 = 'erc20',
  NATIVE = 'native'
}

export type SupportedTokens = SUPPORTED_TOKENS.RIF | SUPPORTED_TOKENS.RBTC

export type TokenTypes = TOKEN_TYPES.NATIVE | TOKEN_TYPES.ERC20

export type TokenContractsType = ERC20ContractI

export type Token = {
  token: SupportedTokens
  type: TokenTypes
  tokenContract: TokenContractsType
}

export type TxOptions = TransactionOptions & {
  gasMultiplier?: number
  token?: SupportedTokens
  onApprove?: (receipt: TransactionReceipt) => void
}

export const TOKENS: { [key: string]: Token } = {
  [SUPPORTED_TOKENS.RBTC]: { token: SUPPORTED_TOKENS.RBTC, type: TOKEN_TYPES.NATIVE } as Token,
  [SUPPORTED_TOKENS.RIF]: { token: SUPPORTED_TOKENS.RIF, type: TOKEN_TYPES.ERC20, tokenContract: RifERC20Contract as unknown as ERC20ContractI },
}
