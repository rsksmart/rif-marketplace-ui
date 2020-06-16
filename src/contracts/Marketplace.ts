import ERC721SimplePlacementsV1 from '@rsksmart/rif-marketplace-nfts/ERC721SimplePlacementsV1Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import contractAdds from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const marketPlaceAddress = contractAdds[network].marketplace.toLowerCase()

let contract: Contract | undefined

export default (web3: Web3): Contract => {
  if (!contract) contract = new web3.eth.Contract(ERC721SimplePlacementsV1.abi as AbiItem[], marketPlaceAddress)
  return contract
}
