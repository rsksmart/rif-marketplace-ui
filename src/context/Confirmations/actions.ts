import Logger from 'utils/Logger'
import { Actions } from './interfaces'

const logger = Logger.getInstance()

const actions: Actions = {
  NEW_CONFIRMATION: (state, payload) => {
    const {
      transactionHash,
      targetConfirmation,
      confirmations,
      event,
    } = payload
    const stateCopy = { ...state }
    // TODO:
    // - chequear si existe, si no crearla
    // - si llega al target borrar el txHash del diccionario
    // - chequear si conviene usar event as eventName para llevar mapeo de servicios que esperan confs, puede mejorar performance
    logger.info('newConfirmation dispatched: ', { event })
    stateCopy.txHashServiceMap[transactionHash] = {
      ...state.txHashServiceMap[transactionHash],
      currentCount: confirmations,
      targetCount: targetConfirmation, // could be unnecessary if already set, but at the beginning it's needed
    }
    return stateCopy
  },
}

export default actions
