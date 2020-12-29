import {
  ConfirmationsRecord, ContractAction, ConfirmationData,
} from './interfaces'

type GetConfirmationsFor = (
  contractActions: ContractAction[],
  confirmations: ConfirmationsRecord
) => ConfirmationData[]

const getConfirmationsFor: GetConfirmationsFor = (
  contractActions,
  confirmations,
) => (
  Object.values(confirmations).filter(
    ({
      contractAction: confContractAction,
    }) => contractActions.some((conf) => conf === confContractAction),
  )
)

export default getConfirmationsFor
