import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'

function waitForReceipt(txHash, web3: Web3) {
  let timeElapsed = 0
  const interval = 2000
  return new Promise<TransactionReceipt>((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      timeElapsed += interval
      const receipt = await web3.eth.getTransactionReceipt(txHash)

      if (receipt != null) {
        clearInterval(checkInterval)
        resolve(receipt)
      }

      if (timeElapsed > 120000) {
        reject(new Error('Transaction receipt could not be retrieved - Timeout'))
      }
    }, interval)
  })
}

export default waitForReceipt
