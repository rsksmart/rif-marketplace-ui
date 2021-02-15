import AgreementsContext, {
  Provider,
  initialState,
} from './Context'
import {
  Props,
  Action,
  State,
} from './interfaces'

export {
  Provider as AgreementsContextProvider,
  initialState as agreementsInitialState,
}
export type AgreementContextProps = Props
export type AgreementAction = Action
export type AgreementsContextState = State

export default AgreementsContext
