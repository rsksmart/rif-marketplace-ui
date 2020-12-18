import {
  Actions, NewConfirmationPayload, NewRequestPayload, State,
} from './interfaces'

const actions: Actions = {
  NEW_CONFIRMATION: (state: State, {
    transactionHash, targetConfirmation, confirmations: confirmationsCount,
  }: NewConfirmationPayload) => {
    const { confirmations } = state
    const confirmationsCopy = { ...confirmations }
    const confirmationRecord = confirmationsCopy[transactionHash]

    if (!confirmationRecord) { // this conf is not being tracked
      return { ...state }
    }

    if (confirmationsCount >= targetConfirmation) {
      delete confirmationsCopy[transactionHash]
    } else {
      confirmationRecord.currentCount = confirmationsCount
      confirmationRecord.targetCount = targetConfirmation
    }
    return {
      ...state,
      confirmations: confirmationsCopy,
    }
  },
  NEW_REQUEST: (state: State, {
    txHash,
    contractAction,
    contractActionData,
  }: NewRequestPayload) => (
    {
      ...state,
      confirmations: {
        ...state.confirmations,
        [txHash]: {
          currentCount: 0,
          contractAction,
          contractActionData,
        },
      },
    }
  ),
}

export default actions
