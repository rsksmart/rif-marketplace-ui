import {
  ConfirmationsRecord, ContractAction, ConfirmationData,
} from './interfaces'

type GetConfirmationsFor = (
  contractAction: ContractAction,
  confirmations: ConfirmationsRecord
) => ConfirmationData[]

const getConfirmationsFor: GetConfirmationsFor = (
  contractAction,
  confirmations,
) => (
  Object.values(confirmations).filter(
    ({
      contractAction: confContractAction,
    }) => confContractAction === contractAction,
  )
)

export default getConfirmationsFor
