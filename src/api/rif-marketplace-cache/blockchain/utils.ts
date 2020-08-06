import { ConfirmationsTransportItem, Confirmations } from './confirmations'

const mapFromTransport = (data: ConfirmationsTransportItem[]): Confirmations => data.reduce((map, item: ConfirmationsTransportItem) => {
  const newMap = { ...map }
  newMap[item.transactionHash] = {
    currentCount: item.confirmations,
    targetCount: item.targetConfirmation,
  }
  return newMap
}, {})

const utils = {
  mapFromTransport,
}

export default utils
