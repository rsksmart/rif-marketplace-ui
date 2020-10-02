import { MarketplaceContractErrorId } from './Marketplace'
import { RifContractErrorId } from './Rif'
import { RnsContractErrorId } from './Rns'
import { StorageContractErrorId } from './storage/contract'

export type Web3ErrorId = 'web3-getGasPrice'

export type ContractErrorId =
  | Web3ErrorId
  | MarketplaceContractErrorId
  | RifContractErrorId
  | RnsContractErrorId
  | StorageContractErrorId
