import withContext, {
  Context,
  Provider,
  Props,
} from './Context'

export {
  Context as StorageOffersContext,
  Provider as StorageOffersContextProvider,
}

export type StorageOffersContextProps = Props

const withStorageOffersContext = withContext

export default withStorageOffersContext
