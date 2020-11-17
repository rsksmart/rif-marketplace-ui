import { TransactionReceipt } from 'web3-eth'
import Web3 from 'web3'

import { ZERO_ADDRESS } from '../constants/strings'
import { RifERC20Contract } from './tokens/rif'
import { MarketplaceContractErrorId } from './Marketplace'
import { RnsContractErrorId } from './Rns'
import { StorageStakingContractErrorId } from './Staking'
import { StorageContractErrorId } from './storage'
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

export type SingletonContract = { getInstance(web3: Web3): any }

export type Token = {
  token: SupportedTokens
  type: TokenTypes
  tokenContract: SingletonContract
  tokenAddress: string
}

export type TxOptions = TransactionOptions & {
  gasMultiplier?: number
  token?: SupportedTokens
  onApprove?: (receipt: TransactionReceipt) => void
}

export const TOKENS: Record<SupportedTokens, Token> = {
  [SUPPORTED_TOKENS.RBTC]: { token: SUPPORTED_TOKENS.RBTC, type: TOKEN_TYPES.NATIVE, tokenAddress: ZERO_ADDRESS } as Token,
  [SUPPORTED_TOKENS.RIF]: {
    token: RifERC20Contract.tokenName, type: RifERC20Contract.tokenType, tokenContract: RifERC20Contract, tokenAddress: RifERC20Contract.tokenAddress,
  },
}
