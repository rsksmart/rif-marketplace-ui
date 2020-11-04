import { Transport as ConfirmationTransport, Confirmations } from './confirmations'

const mapFromTransport = (
  data: ConfirmationTransport[],
): Confirmations => data.reduce((map, item: ConfirmationTransport) => {
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
