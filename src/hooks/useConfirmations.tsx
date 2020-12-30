import { ConfirmationsContext } from 'context/Confirmations'
import { ConfirmationData, ContractAction } from 'context/Confirmations/interfaces'
import getConfirmationsFor from 'context/Confirmations/utils'
import { useContext } from 'react'

// ================================================================
// this custom hook is only supposed to be used on ConfirmationsContextProvider
// children components
// ================================================================

const useConfirmations = (
  contractActions: ContractAction[],
): ConfirmationData[] => {
  const {
    state: { confirmations },
  } = useContext(ConfirmationsContext)

  return getConfirmationsFor(contractActions, confirmations)
}

export default useConfirmations
