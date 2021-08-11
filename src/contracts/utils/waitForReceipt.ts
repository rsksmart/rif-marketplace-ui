import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'

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

      if (receipt?.status) {
        clearInterval(checkInterval)
        resolve(receipt)
      }

      if (receipt && !receipt.status) {
        reject(
          new Error(`Transaction reverted, ${web3.eth.handleRevert && 'please, see the "MetaMask - RPC Error" bellow, under "data.error.message" for details.'}  receipt: ${JSON.stringify(receipt, null, 2)}`),
        )
      }

      if (timeElapsed > TIMEOUT_LIMIT) {
        reject(
          new Error('Transaction receipt could not be retrieved - Timeout'),
        )
      }
    }, POLLING_INTERVAL)
  })
}

export default waitForReceipt
