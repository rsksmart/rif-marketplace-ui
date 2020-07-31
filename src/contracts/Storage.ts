import StorageManager from '@rsksmart/rif-marketplace-storage/build/contracts/StorageManager.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import { storageAddress } from './config'

class StorageContract {
  public static getInstance(web3: Web3): StorageContract {
    if (!StorageContract.instance) {
      StorageContract.instance = new StorageContract(web3)
    }
    return StorageContract.instance
  }

  private static instance: StorageContract

  private contract: Contract

  private web3: Web3

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(
      StorageManager.abi as AbiItem[],
      storageAddress,
    )
    this.web3 = web3
  }
}

export default StorageContract
