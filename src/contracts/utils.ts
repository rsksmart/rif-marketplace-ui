import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { asciiToHex } from 'web3-utils'

export interface TransactionOptions {
  from?: string
  gas?: number
  gasPrice?: string
}

const TIMEOUT_LIMIT = 120000
const POLLING_INTERVAL = 2000

function waitForReceipt(
  txHash: string,
  web3: Web3,
): Promise<TransactionReceipt> {
  let timeElapsed = 0
  return new Promise<TransactionReceipt>((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      timeElapsed += POLLING_INTERVAL
      const receipt = await web3.eth.getTransactionReceipt(txHash)

      if (receipt != null) {
        clearInterval(checkInterval)
        resolve(receipt)
      }

      if (timeElapsed > TIMEOUT_LIMIT) {
        reject(
          new Error('Transaction receipt could not be retrieved - Timeout'),
        )
      }
    }, POLLING_INTERVAL)
  })
}

export function prefixArray(
  arr: string[],
  prefix: string,
  lengthPerElement = 32,
): string[] {
  if (prefix.length >= lengthPerElement) {
    throw new Error(`Too long prefix! Max ${lengthPerElement} chars!`)
  }

  const endingLength = lengthPerElement - prefix.length

  let tmp
  let carryOver = prefix
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > lengthPerElement) {
      throw new Error(`Element ${i} was longer then expected!`)
    }

    tmp = `${carryOver}${arr[i].slice(0, endingLength)}`
    carryOver = arr[i].slice(endingLength)
    // eslint-disable-next-line no-param-reassign
    arr[i] = tmp
  }

  if (carryOver) {
    arr.push(carryOver)
  }

  return arr
}

export function encodeHash(hash: string): string[] {
  if (hash.length <= 32) {
    return [asciiToHex(hash)]
  }

  return [asciiToHex(hash.slice(0, 32)), ...encodeHash(hash.slice(32))]
}

export default waitForReceipt
