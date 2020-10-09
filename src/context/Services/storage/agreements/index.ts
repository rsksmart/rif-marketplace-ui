import AgreementsContext, {
  Provider,
  initialState,
} from './Context'
import {
  Props,
  Action,
} from './interfaces'

export {
  Provider as AgreementsContextProvider,
  initialState as agreementsInitialState,
}
export type AgreementContextProps = Props
export type AgreementAction = Action

export default AgreementsContext
