import { ConfirmationsTransportItem, Confirmations } from './confirmations'

/* eslint-disable no-param-reassign */
const mapFromTransport = (data: ConfirmationsTransportItem[]): Confirmations => data.reduce((map, item: ConfirmationsTransportItem) => {
  map[item.transactionHash] = {
    currentCount: item.confirmations,
    targetCount: item.targetConfirmation,
  }
  return map
}, {})
/* eslint-enable no-param-reassign */

const utils = {
  mapFromTransport,
}

export default utils
