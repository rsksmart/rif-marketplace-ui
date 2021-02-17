import Context, {
  AppContextProvider,
  initialState,
} from './Context'
import appActions from './actions'
import { Props, ContextName, State } from './interfaces'
import { errorReporterFactory } from './errorReporter'

export {
  AppContextProvider,
  initialState,
  appActions,
  errorReporterFactory,
}

export type AppContextProps = Props
export type AppContextName = ContextName
export type AppState = State

export default Context
