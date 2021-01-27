import MarketContext, {
  Provider, initialState,
} from './Context'
import { Props, Action } from './interfaces'

export {
  Provider as MarketContextProvider,
  initialState as marketInitialState,
}
export type MarketContextProps = Props
export type MarketAction = Action

export default MarketContext
