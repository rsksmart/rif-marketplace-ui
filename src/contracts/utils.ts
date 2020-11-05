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

const withWaitForReceipt = (web3: Web3) => (
  err, response,
): Promise<TransactionReceipt | never> => {
  if (err) return Promise.reject(err)
  return waitForReceipt(response, web3)
}

export default withWaitForReceipt
