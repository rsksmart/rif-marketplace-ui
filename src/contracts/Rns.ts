import ERC721 from '@rsksmart/erc721/ERC721Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import contractAdds from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const rnsAddress = contractAdds[network].rnsDotRskOwner.toLowerCase()

let contract: Contract | undefined

export default (web3: Web3): Contract => {
  if (!contract) contract = new web3.eth.Contract(ERC721.abi as AbiItem[], rnsAddress)
  return contract
}
