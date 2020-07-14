import { MarketplaceContractErrorId } from './Marketplace'
import { RifContractErrorId } from './Rif'
import { RnsContractErrorId } from './Rns'

export type Web3ErrorId = 'web3-getGasPrice'

export type ContractErrorId = Web3ErrorId | MarketplaceContractErrorId | RifContractErrorId | RnsContractErrorId
