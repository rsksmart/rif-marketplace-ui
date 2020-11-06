import { TransactionReceipt } from 'web3-eth'

import { ContractBase } from './contract-wrapper'
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

export interface ERC20ContractI extends ContractBase {
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

export enum TOKENS {
  RIF = 'rif',
  RBTC = 'rbtc'
}

export enum TOKENS_TYPES {
  ERC20 = 'erc20',
}

export type SupportedTokens = TOKENS.RIF | TOKENS.RBTC

export type TokenTypes = TOKENS_TYPES.ERC20

export type TokenContractsType = ERC20ContractI

export type Token = {
  token: SupportedTokens
  type: TokenTypes
  tokenContract: TokenContractsType
}

export type TxOptions = TransactionOptions & {
  gasMultiplayer?: number
  token?: SupportedTokens
  onApprove?: (receipt: TransactionReceipt) => void
}
