import ERC677 from '@rsksmart/erc677/ERC677Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import contractAdds from 'ui-config.json'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const rifTokenAddress = contractAdds[network].rif.toLowerCase()


let contract: Contract | undefined

export default (web3: Web3): Contract => {
  if (!contract) contract = new web3.eth.Contract(ERC677.abi as AbiItem[], rifTokenAddress)
  return contract
}
