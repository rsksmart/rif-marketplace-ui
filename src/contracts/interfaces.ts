import { TransactionReceipt } from 'web3-eth'
import Web3 from 'web3'

import { ZERO_ADDRESS } from '../constants/strings'
import { rifTokenAddress } from './config'
import { RifERC20Contract } from './tokens/rif'
import { MarketplaceContractErrorId } from './rns/Marketplace'
import { PaymentWrapper, RnsContractErrorId } from './rns/Rns'
import { StorageStakingContractErrorId } from './storage/Staking'
import { StorageContractErrorId } from './storage/Storage'
import type { RifERC677ContractErrorId, RifERC20ContractErrorId } from './tokens/rif'

export interface TransactionOptions {
  from?: string
  gas?: number
  gasPrice?: string
  value?: string | number
}

export interface ERC20ContractI extends PaymentWrapper{
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

export enum SUPPORTED_TOKENS {
  rif = 'rif',
  rbtc = 'rbtc'
}

export enum TOKEN_TYPES {
  ERC20 = 'erc20',
  NATIVE = 'native'
}

export type SupportedTokens = SUPPORTED_TOKENS.rif | SUPPORTED_TOKENS.rbtc

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
  [SUPPORTED_TOKENS.rbtc]: {
    token: SUPPORTED_TOKENS.rbtc,
    type: TOKEN_TYPES.NATIVE,
    tokenAddress: ZERO_ADDRESS,
  } as Token,
  [SUPPORTED_TOKENS.rif]: {
    token: SUPPORTED_TOKENS.rif,
    type: TOKEN_TYPES.ERC20,
    tokenContract: RifERC20Contract,
    tokenAddress: rifTokenAddress,
  },
}
